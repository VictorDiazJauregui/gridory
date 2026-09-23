import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import {
  applyHistoryStrategy,
  isContextLengthError,
  streamChatCompletion,
  type StreamChatCompletionResult,
} from "./ai-client";
import { buildToolDefinitions } from "./tool-definitions";
import type { ResolvedChatConfig } from "./use-resolved-chat-config";
import type { AIChatMessage, AIHistoryStrategy } from "./types";

interface StreamRequest {
  resolved: ResolvedChatConfig;
  tools: ChatCompletionTool[] | undefined;
  onContent: (fullContent: string) => void;
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
};

const resolveTools = (
  resolved: ResolvedChatConfig,
): ChatCompletionTool[] | undefined => {
  const { enableActions, dataSchema, mode } = resolved;
  return enableActions && dataSchema && dataSchema.fields.length > 0
    ? buildToolDefinitions(dataSchema.fields, mode)
    : undefined;
};

const streamPayload = (
  { resolved, tools, onContent }: StreamRequest,
  messages: ChatCompletionMessageParam[],
): Promise<StreamChatCompletionResult> =>
  streamChatCompletion({
    client: resolved.client,
    messages,
    model: resolved.providerConfig.model,
    temperature: resolved.providerConfig.temperature,
    maxTokens: resolved.providerConfig.maxTokens,
    tools,
    onContent: (fullContent) => {
      onContent(fullContent);
    },
  });

const streamWithRetry = async (
  request: StreamRequest,
  fullMessages: ChatCompletionMessageParam[],
  strategy: AIHistoryStrategy,
): Promise<StreamChatCompletionResult> => {
  const { maxMessages } = request.resolved.memory;
  const primaryPayload = applyHistoryStrategy(
    fullMessages,
    strategy,
    maxMessages,
  );
  try {
    return await streamPayload(request, primaryPayload);
  } catch (streamError) {
    return streamPayload(
      request,
      resolveRetryPayload(streamError, { fullMessages, strategy, maxMessages }),
    );
  }
};

export const requestCompletion = (
  resolved: ResolvedChatConfig,
  history: AIChatMessage[],
  onContent: (fullContent: string) => void,
): Promise<StreamChatCompletionResult> => {
  const fullMessages = toOpenAIMessages(history, resolved.systemPrompt);
  const strategy = resolved.memory.enabled ? resolved.memory.strategy : "none";
  return streamWithRetry(
    { resolved, tools: resolveTools(resolved), onContent },
    fullMessages,
    strategy,
  );
};
