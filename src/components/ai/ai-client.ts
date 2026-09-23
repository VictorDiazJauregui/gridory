import OpenAI from "openai";
import type {
  ChatCompletionChunk,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import type { AIHistoryStrategy, AIProviderConfig } from "./types";

export interface AIParsedToolCall {
  id: string;
  name: string;
  arguments: string;
  parsedArguments: Record<string, unknown> | null;
}

interface StreamChatCompletionParams {
  client: OpenAI;
  messages: ChatCompletionMessageParam[];
  model: string;
  temperature?: number;
  maxTokens?: number;
  tools?: ChatCompletionTool[];
  onContent?: (fullContent: string, delta: string) => void;
}

export interface StreamChatCompletionResult {
  content: string;
  toolCalls: AIParsedToolCall[];
  rawResponse: string;
}

type ToolCallDelta = ChatCompletionChunk.Choice.Delta.ToolCall;

const fallbackConfig: Pick<AIProviderConfig, "temperature" | "maxTokens"> = {
  temperature: 0.7,
  maxTokens: 2048,
};

const CONTEXT_LENGTH_ERROR_HINTS = [
  "context_length_exceeded",
  "maximum context length",
  "context window",
  "too many tokens",
  "prompt is too long",
  "reduce the length",
];

export const isContextLengthError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  const message = error.message?.toLowerCase() ?? "";
  return CONTEXT_LENGTH_ERROR_HINTS.some((hint) => message.includes(hint));
};

const parseToolCallArguments = (value: string): Record<string, unknown> | null => {
  if (!value.trim()) return null;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const resolveBaseURL = (baseURL: string): string => {
  const trimmed = baseURL.trim();
  if (!trimmed) return trimmed;

  const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed);
  if (hasProtocol) return trimmed;

  if (typeof window !== "undefined") {
    return new URL(trimmed, window.location.origin).toString();
  }
  return trimmed;
};

export const createAIClient = (config: AIProviderConfig): OpenAI => {
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: resolveBaseURL(config.baseURL),
    dangerouslyAllowBrowser: true,
  });
};

const withSystemMessage = (
  systemMessage: ChatCompletionMessageParam | undefined,
  rest: ChatCompletionMessageParam[],
): ChatCompletionMessageParam[] =>
  systemMessage ? [systemMessage, ...rest] : rest;

const keepLastByRole = (
  conversation: ChatCompletionMessageParam[],
  roles: Array<ChatCompletionMessageParam["role"]>,
): ChatCompletionMessageParam[] => {
  const reversed = [...conversation].reverse();
  return roles.flatMap((role) => {
    const last = reversed.find((message) => message.role === role);
    return last ? [last] : [];
  });
};

const selectConversation = (
  conversation: ChatCompletionMessageParam[],
  strategy: AIHistoryStrategy,
  maxMessages: number,
): ChatCompletionMessageParam[] => {
  if (strategy === "none") return keepLastByRole(conversation, ["user"]);
  if (strategy === "minimal") {
    return keepLastByRole(conversation, ["assistant", "user"]);
  }
  return conversation.slice(-Math.max(2, maxMessages));
};

export const applyHistoryStrategy = (
  messages: ChatCompletionMessageParam[],
  strategy: AIHistoryStrategy,
  maxMessages: number,
): ChatCompletionMessageParam[] => {
  const systemMessage = messages.find((message) => message.role === "system");
  const conversation = messages.filter((message) => message.role !== "system");
  if (conversation.length === 0) return withSystemMessage(systemMessage, []);
  return withSystemMessage(
    systemMessage,
    selectConversation(conversation, strategy, maxMessages),
  );
};

const mergeToolCallDelta = (
  partials: Record<number, AIParsedToolCall>,
  toolCall: ToolCallDelta,
  fallbackIndex: number,
) => {
  const key = toolCall.index ?? fallbackIndex;
  const existing = partials[key] ?? {
    id: toolCall.id ?? `tool-${key}`,
    name: "",
    arguments: "",
    parsedArguments: null,
  };
  const functionName = toolCall.function?.name;
  if (functionName) existing.name = functionName;
  if (toolCall.id) existing.id = toolCall.id;
  if (toolCall.function?.arguments) {
    existing.arguments += toolCall.function.arguments;
  }
  partials[key] = existing;
};

const mergeToolCallChunks = (
  chunk: ChatCompletionChunk,
  partials: Record<number, AIParsedToolCall>,
) => {
  const toolCalls = chunk.choices[0]?.delta?.tool_calls;
  if (!toolCalls || toolCalls.length === 0) return;
  toolCalls.forEach((toolCall, index) =>
    mergeToolCallDelta(partials, toolCall, index),
  );
};

const createCompletionStream = (params: StreamChatCompletionParams) => {
  const {
    client,
    messages,
    model,
    temperature = fallbackConfig.temperature,
    maxTokens = fallbackConfig.maxTokens,
    tools,
  } = params;
  return client.chat.completions.create({
    model,
    stream: true,
    messages,
    temperature,
    max_completion_tokens: maxTokens,
    tools,
  });
};

const consumeStream = async (
  stream: AsyncIterable<ChatCompletionChunk>,
  onContent: StreamChatCompletionParams["onContent"],
) => {
  let content = "";
  const partialToolCalls: Record<number, AIParsedToolCall> = {};
  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content ?? "";
    if (token) {
      content += token;
      onContent?.(content, token);
    }
    mergeToolCallChunks(chunk, partialToolCalls);
  }
  return { content, partialToolCalls };
};

const finalizeToolCalls = (
  partials: Record<number, AIParsedToolCall>,
): AIParsedToolCall[] =>
  Object.values(partials).map((toolCall) => ({
    ...toolCall,
    parsedArguments: parseToolCallArguments(toolCall.arguments),
  }));

export const streamChatCompletion = async (
  params: StreamChatCompletionParams,
): Promise<StreamChatCompletionResult> => {
  const stream = await createCompletionStream(params);
  const { content, partialToolCalls } = await consumeStream(
    stream,
    params.onContent,
  );
  return {
    content: content.trim(),
    toolCalls: finalizeToolCalls(partialToolCalls),
    rawResponse: content,
  };
};
