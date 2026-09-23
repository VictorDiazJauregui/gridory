import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import {
  applyHistoryStrategy,
  createAIClient,
  isContextLengthError,
  streamChatCompletion,
} from "./ai-client";
import { buildToolDefinitions } from "./tool-definitions";
import { createId } from "./create-id";
import { normalizeAIError, toError } from "./chat-errors";
import { mapToolCallToAction, toActionEvent } from "./pending-actions";
import { resolveFallbackActions } from "./fallback-action";
import { DEFAULT_MEMORY_CONFIG, DEFAULT_TEXTS } from "./constants";
import type {
  AIActionEvent,
  AIChatMessage,
  AIChatMode,
  AIDataSchema,
  AIHistoryStrategy,
  AIMemoryConfig,
  AIPendingAction,
  AIProviderConfig,
  AITextOverrides,
} from "./types";

interface UseAIChatConfig {
  providerConfig: AIProviderConfig;
  systemPrompt: string;
  mode: AIChatMode;
  dataSchema?: AIDataSchema;
  enableActions?: boolean;
  memory?: AIMemoryConfig;
  texts?: AITextOverrides;
  onAction?: (event: AIActionEvent) => void;
  onError?: (error: Error) => void;
}

interface UseAIChatReturn {
  messages: AIChatMessage[];
  pendingActions: AIPendingAction[];
  isLoading: boolean;
  streamingContent: string;
  sendMessage: (text: string) => Promise<void>;
  confirmAction: (actionId: string) => void;
  rejectAction: (actionId: string) => void;
  resetConversation: () => void;
  clearMessages: () => void;
}

const resolveMemoryConfig = (
  memory: AIMemoryConfig | undefined,
): Required<AIMemoryConfig> => {
  if (!memory) return DEFAULT_MEMORY_CONFIG;
  return {
    enabled: memory.enabled,
    strategy: memory.strategy ?? DEFAULT_MEMORY_CONFIG.strategy,
    maxMessages: memory.maxMessages ?? DEFAULT_MEMORY_CONFIG.maxMessages,
  };
}

interface RetryContext {
  fullMessages: ChatCompletionMessageParam[];
  strategy: AIHistoryStrategy;
  maxMessages: number;
}

const resolveRetryPayload = (
  error: unknown,
  { fullMessages, strategy, maxMessages }: RetryContext,
): ChatCompletionMessageParam[] => {
  if (!isContextLengthError(error) || strategy === "minimal") throw error;
  if (strategy === "sliding-window") {
    return applyHistoryStrategy(
      fullMessages,
      "sliding-window",
      Math.max(2, Math.floor(maxMessages / 2)),
    );
  }
  return applyHistoryStrategy(fullMessages, "minimal", maxMessages);
};

const toOpenAIMessages = (
  messages: AIChatMessage[],
  systemPrompt: string,
): ChatCompletionMessageParam[] => {
  const conversation = messages
    .filter((message) => message.role !== "system")
    .map(
      (message): ChatCompletionMessageParam => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content,
      }),
    );
  return [{ role: "system", content: systemPrompt }, ...conversation];
}

export const useAIChat = (config: UseAIChatConfig): UseAIChatReturn => {
  const {
    providerConfig,
    systemPrompt,
    mode,
    dataSchema,
    enableActions = mode !== "chatbot",
    memory,
    texts,
    onAction,
    onError,
  } = config;

  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [pendingActions, setPendingActions] = useState<AIPendingAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesRef = useRef<AIChatMessage[]>([]);
  const pendingActionsRef = useRef<AIPendingAction[]>([]);

  const resolvedMemory = useMemo(() => resolveMemoryConfig(memory), [memory]);
  const resolvedTexts = useMemo(
    () => ({ ...DEFAULT_TEXTS, ...texts }),
    [texts],
  );

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    pendingActionsRef.current = pendingActions;
  }, [pendingActions]);

  const client = useMemo(
    () => createAIClient(providerConfig),
    [providerConfig],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      if (!providerConfig.apiKey?.trim()) {
        const error = new Error(resolvedTexts.missingApiKey);
        onError?.(error);
        setMessages((previous) => [
          ...previous,
          {
            id: createId(),
            role: "assistant",
            content: error.message,
            timestamp: Date.now(),
          },
        ]);
        return;
      }

      const userMessage: AIChatMessage = {
        id: createId(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      setMessages((previous) => [...previous, userMessage]);
      setIsLoading(true);
      setStreamingContent("");

      try {
        const fullMessages = toOpenAIMessages(
          [...messagesRef.current, userMessage],
          systemPrompt,
        );

        const strategy = resolvedMemory.enabled
          ? resolvedMemory.strategy
          : "none";

        const primaryPayload = applyHistoryStrategy(
          fullMessages,
          strategy,
          resolvedMemory.maxMessages,
        );

        const tools =
          enableActions && dataSchema && dataSchema.fields.length > 0
            ? buildToolDefinitions(dataSchema.fields, mode)
            : undefined;

        const runStream = (messagesToSend: ChatCompletionMessageParam[]) =>
          streamChatCompletion({
            client,
            messages: messagesToSend,
            model: providerConfig.model,
            temperature: providerConfig.temperature,
            maxTokens: providerConfig.maxTokens,
            tools,
            onContent: (fullContent) => {
              setStreamingContent(fullContent);
            },
          });

        let result;
        try {
          result = await runStream(primaryPayload);
        } catch (streamError) {
          result = await runStream(
            resolveRetryPayload(streamError, {
              fullMessages,
              strategy,
              maxMessages: resolvedMemory.maxMessages,
            }),
          );
        }

        setStreamingContent("");

        const mappedActions = enableActions
          ? result.toolCalls
              .map((toolCall) =>
                mapToolCallToAction({
                  toolCall,
                  rawResponse: result.rawResponse || result.content,
                  mode,
                  schema: dataSchema,
                }),
              )
              .filter((action): action is AIPendingAction => Boolean(action))
          : [];

        const newActions =
          mappedActions.length > 0
            ? mappedActions
            : resolveFallbackActions(result.content, {
                enableActions,
                mode,
                schema: dataSchema,
              });
        if (newActions.length > 0) {
          setPendingActions((previous) => [...previous, ...newActions]);
        }

        const assistantText =
          result.content.trim() ||
          (mappedActions.length > 0
            ? resolvedTexts.actionProposed
            : resolvedTexts.noResponse);

        setMessages((previous) => [
          ...previous,
          {
            id: createId(),
            role: "assistant",
            content: assistantText,
            timestamp: Date.now(),
          },
        ]);
      } catch (unknownError) {
        const error = normalizeAIError(
          toError(unknownError, resolvedTexts.genericError),
          providerConfig.baseURL,
        );
        onError?.(error);
        setMessages((previous) => [
          ...previous,
          {
            id: createId(),
            role: "assistant",
            content: `Ocurrió un error: ${error.message}`,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
        setStreamingContent("");
      }
    },
    [
      isLoading,
      providerConfig,
      onError,
      client,
      systemPrompt,
      enableActions,
      mode,
      dataSchema,
      resolvedMemory,
      resolvedTexts,
    ],
  );

  const confirmAction = useCallback(
    (actionId: string) => {
      const actionToConfirm = pendingActionsRef.current.find(
        (action) => action.id === actionId,
      );
      if (!actionToConfirm) return;
      setPendingActions((previous) =>
        previous.filter((action) => action.id !== actionId),
      );

      try {
        onAction?.(toActionEvent(actionToConfirm));
        setMessages((previous) => [
          ...previous,
          {
            id: createId(),
            role: "assistant",
            content: resolvedTexts.actionConfirmed,
            timestamp: Date.now(),
          },
        ]);
      } catch (unknownError) {
        const error = toError(
          unknownError,
          "No se pudo confirmar la acción.",
        );
        onError?.(error);
        setMessages((previous) => [
          ...previous,
          {
            id: createId(),
            role: "assistant",
            content: `No pude confirmar la acción: ${error.message}`,
            timestamp: Date.now(),
          },
        ]);
      }
    },
    [onAction, onError, resolvedTexts],
  );

  const rejectAction = useCallback(
    (actionId: string) => {
      setPendingActions((previous) =>
        previous.filter((action) => action.id !== actionId),
      );
      setMessages((previous) => [
        ...previous,
        {
          id: createId(),
          role: "assistant",
          content: resolvedTexts.actionCancelled,
          timestamp: Date.now(),
        },
      ]);
    },
    [resolvedTexts],
  );

  const resetConversation = useCallback(() => {
    setMessages([]);
    setPendingActions([]);
    setStreamingContent("");
  }, []);

  return {
    messages,
    pendingActions,
    isLoading,
    streamingContent,
    sendMessage,
    confirmAction,
    rejectAction,
    resetConversation,
    clearMessages: resetConversation,
  };
}
