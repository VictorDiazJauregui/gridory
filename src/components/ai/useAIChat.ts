import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import {
  applyHistoryStrategy,
  buildToolDefinitions,
  createAIClient,
  isContextLengthError,
  streamChatCompletion,
  type AIParsedToolCall,
} from "./ai-client";
import { DEFAULT_MEMORY_CONFIG, DEFAULT_TEXTS } from "./constants";
import type {
  AIActionEvent,
  AIActionType,
  AIChatMessage,
  AIChatMode,
  AIDataSchema,
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

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveMemoryConfig(
  memory: AIMemoryConfig | undefined,
): Required<AIMemoryConfig> {
  if (!memory) return DEFAULT_MEMORY_CONFIG;
  return {
    enabled: memory.enabled,
    strategy: memory.strategy ?? DEFAULT_MEMORY_CONFIG.strategy,
    maxMessages: memory.maxMessages ?? DEFAULT_MEMORY_CONFIG.maxMessages,
  };
}

function normalizeAIError(error: Error, baseURL: string): Error {
  const message = error.message?.toLowerCase() ?? "";
  const isConnectionError =
    message.includes("connection error") ||
    message.includes("failed to fetch") ||
    message.includes("network");
  const looksLikeDirectGoogleEndpoint = baseURL.includes(
    "generativelanguage.googleapis.com",
  );

  if (isConnectionError && looksLikeDirectGoogleEndpoint) {
    return new Error(
      "Connection error. Posible CORS al llamar Gemini directo desde navegador. En desarrollo usa un proxy (ej. /api/google-openai en Vite) o realiza la llamada desde backend.",
    );
  }
  return error;
}

function extractJsonBlock(content: string): string | null {
  const fencedMatch = content.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();

  const objectMatch = content.match(/\{[\s\S]*\}/);
  return objectMatch?.[0] ? objectMatch[0].trim() : null;
}

function parseFallbackAction(
  content: string,
  mode: AIChatMode,
): AIPendingAction | null {
  const jsonRaw = extractJsonBlock(content);
  if (!jsonRaw) return null;

  try {
    const parsed = JSON.parse(jsonRaw) as Record<string, unknown>;
    const rawType = String(parsed.type ?? parsed.action ?? "").toLowerCase();

    const hasRecordObject =
      typeof parsed.record === "object" && parsed.record !== null;
    const hasUpdatesObject =
      typeof parsed.updates === "object" && parsed.updates !== null;
    const hasMoveShape =
      (typeof parsed.targetColumn === "string" ||
        typeof parsed.target_column === "string") &&
      typeof parsed.id === "string";

    const actionType: AIActionType = rawType
      ? rawType === "create-row" ||
        rawType === "create_record" ||
        rawType === "create"
        ? mode === "kanban"
          ? "create-card"
          : "create-row"
        : rawType === "create-card"
          ? "create-card"
          : rawType === "update-row" || rawType === "update_record"
            ? "update-row"
            : rawType === "move-card" || rawType === "move_card"
              ? "move-card"
              : "custom"
      : hasRecordObject
        ? mode === "kanban"
          ? "create-card"
          : "create-row"
        : hasUpdatesObject
          ? "update-row"
          : hasMoveShape
            ? "move-card"
            : "custom";

    const payload =
      (parsed.payload as Record<string, unknown> | undefined) ??
      (parsed.record as Record<string, unknown> | undefined) ??
      parsed;

    return {
      id: `fallback-${createId()}`,
      type: actionType,
      mode,
      payload,
      rawResponse: content,
    };
  } catch {
    return null;
  }
}

function applyFixedValues(
  payload: Record<string, unknown>,
  schema?: AIDataSchema,
): Record<string, unknown> {
  if (!schema) return payload;
  const result: Record<string, unknown> = { ...payload };
  schema.fields.forEach((field) => {
    if (field.fixedValue !== undefined) {
      result[field.id] = field.fixedValue;
    } else if (
      field.defaultValue !== undefined &&
      (result[field.id] === undefined || result[field.id] === null)
    ) {
      result[field.id] = field.defaultValue;
    }
  });
  return result;
}

function mapToolCallToAction(
  toolCall: AIParsedToolCall,
  rawResponse: string,
  mode: AIChatMode,
  schema?: AIDataSchema,
): AIPendingAction | null {
  const args = toolCall.parsedArguments ?? {};

  if (toolCall.name === "create_record") {
    const record =
      (args.record as Record<string, unknown> | undefined) ?? args ?? {};
    return {
      id: toolCall.id || `action-${createId()}`,
      type: mode === "kanban" ? "create-card" : "create-row",
      mode,
      payload: applyFixedValues(record, schema),
      rawResponse,
    };
  }

  if (toolCall.name === "update_record") {
    const updates = (args.updates as Record<string, unknown> | undefined) ?? {};
    const payload: Record<string, unknown> = {
      id: args.id,
      ...applyFixedValues(updates, schema),
    };
    return {
      id: toolCall.id || `action-${createId()}`,
      type: "update-row",
      mode,
      payload,
      rawResponse,
    };
  }

  if (toolCall.name === "move_card") {
    return {
      id: toolCall.id || `action-${createId()}`,
      type: "move-card",
      mode,
      payload: args,
      rawResponse,
    };
  }

  if (Object.keys(args).length > 0) {
    return {
      id: toolCall.id || `action-${createId()}`,
      type: "custom",
      mode,
      payload: args,
      rawResponse,
    };
  }

  return null;
}

function toOpenAIMessages(
  messages: AIChatMessage[],
  systemPrompt: string,
): ChatCompletionMessageParam[] {
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

export function useAIChat(config: UseAIChatConfig): UseAIChatReturn {
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
          if (
            isContextLengthError(streamError) &&
            strategy === "sliding-window"
          ) {
            const reducedPayload = applyHistoryStrategy(
              fullMessages,
              "sliding-window",
              Math.max(2, Math.floor(resolvedMemory.maxMessages / 2)),
            );
            result = await runStream(reducedPayload);
          } else if (
            isContextLengthError(streamError) &&
            strategy !== "minimal"
          ) {
            const minimalPayload = applyHistoryStrategy(
              fullMessages,
              "minimal",
              resolvedMemory.maxMessages,
            );
            result = await runStream(minimalPayload);
          } else {
            throw streamError;
          }
        }

        setStreamingContent("");

        const mappedActions = enableActions
          ? result.toolCalls
              .map((toolCall) =>
                mapToolCallToAction(
                  toolCall,
                  result.rawResponse || result.content,
                  mode,
                  dataSchema,
                ),
              )
              .filter((action): action is AIPendingAction => Boolean(action))
          : [];

        if (mappedActions.length > 0) {
          setPendingActions((previous) => [...previous, ...mappedActions]);
        } else if (enableActions) {
          const fallbackAction = parseFallbackAction(result.content, mode);
          if (fallbackAction) {
            fallbackAction.payload = applyFixedValues(
              fallbackAction.payload,
              dataSchema,
            );
            setPendingActions((previous) => [...previous, fallbackAction]);
          }
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
        const rawError =
          unknownError instanceof Error
            ? unknownError
            : new Error(resolvedTexts.genericError);
        const error = normalizeAIError(rawError, providerConfig.baseURL);
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
        onAction?.({
          type: actionToConfirm.type,
          mode: actionToConfirm.mode,
          payload: actionToConfirm.payload,
          rawResponse: actionToConfirm.rawResponse,
        });
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
        const error =
          unknownError instanceof Error
            ? unknownError
            : new Error("No se pudo confirmar la acción.");
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
