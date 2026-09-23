import OpenAI from "openai";
import type {
  ChatCompletionChunk,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import type {
  AIChatMode,
  AIFieldDescriptor,
  AIHistoryStrategy,
  AIProviderConfig,
} from "./types";

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

interface StreamChatCompletionResult {
  content: string;
  toolCalls: AIParsedToolCall[];
  rawResponse: string;
}

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
}

const parseToolCallArguments = (value: string): Record<string, unknown> | null => {
  if (!value.trim()) return null;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const JSON_SCHEMA_TYPE_BY_VALUE_TYPE: Record<string, string> = {
  number: "number",
  boolean: "boolean",
};

const fieldToSchema = (field: AIFieldDescriptor): Record<string, unknown> => {
  const description = field.description ?? field.label;

  if (field.fixedValue !== undefined) {
    return {
      type: JSON_SCHEMA_TYPE_BY_VALUE_TYPE[typeof field.fixedValue] ?? "string",
      const: field.fixedValue,
      description: `${description}. Valor fijo obligatorio.`,
    };
  }

  if (field.type === "number") {
    return { type: "number", description };
  }
  if (field.type === "boolean") {
    return { type: "boolean", description };
  }
  if (field.type === "date") {
    return {
      type: "string",
      format: "date-time",
      description: `${description}. Usa formato ISO 8601 cuando aplique.`,
    };
  }
  if (field.type === "select") {
    const options = field.options?.map((option) => option.value) ?? [];
    return {
      type: "string",
      enum: options.length > 0 ? options : undefined,
      description:
        options.length > 0
          ? `${description}. Opciones permitidas: ${options.join(", ")}.`
          : description,
    };
  }
  return { type: "string", description };
}

const resolveBaseURL = (baseURL: string): string => {
  const trimmed = baseURL.trim();
  if (!trimmed) return trimmed;

  const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed);
  if (hasProtocol) return trimmed;

  if (typeof window !== "undefined") {
    return new URL(trimmed, window.location.origin).toString();
  }
  return trimmed;
}

export const createAIClient = (config: AIProviderConfig): OpenAI => {
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: resolveBaseURL(config.baseURL),
    dangerouslyAllowBrowser: true,
  });
}

export const buildToolDefinitions = (
  fields: AIFieldDescriptor[],
  mode: AIChatMode,
): ChatCompletionTool[] => {
  if (mode === "chatbot" || fields.length === 0) return [];

  const properties = Object.fromEntries(
    fields.map((field) => [field.id, fieldToSchema(field)]),
  );
  const required = fields
    .filter((field) => field.required || field.fixedValue !== undefined)
    .map((field) => field.id);

  const tools: ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "create_record",
        description:
          "Proponer la creación de un nuevo registro o card con los campos detectados.",
        parameters: {
          type: "object",
          properties: {
            record: {
              type: "object",
              properties,
              required,
            },
          },
          required: ["record"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "update_record",
        description:
          "Proponer actualización de un registro existente usando un id y cambios parciales.",
        parameters: {
          type: "object",
          properties: {
            id: { type: "string", description: "Identificador del registro." },
            updates: {
              type: "object",
              properties,
            },
          },
          required: ["id", "updates"],
        },
      },
    },
  ];

  if (mode === "kanban") {
    tools.push({
      type: "function",
      function: {
        name: "move_card",
        description: "Mover una card a otra columna del tablero kanban.",
        parameters: {
          type: "object",
          properties: {
            id: { type: "string", description: "Identificador de la card." },
            targetColumn: {
              type: "string",
              description: "Columna destino en el tablero kanban.",
            },
          },
          required: ["id", "targetColumn"],
        },
      },
    });
  }

  return tools;
}

export const applyHistoryStrategy = (
  messages: ChatCompletionMessageParam[],
  strategy: AIHistoryStrategy,
  maxMessages: number,
): ChatCompletionMessageParam[] => {
  const systemMessage = messages.find((message) => message.role === "system");
  const conversation = messages.filter((message) => message.role !== "system");

  if (conversation.length === 0) {
    return systemMessage ? [systemMessage] : [];
  }

  if (strategy === "none") {
    const lastUser = [...conversation]
      .reverse()
      .find((message) => message.role === "user");
    return [
      ...(systemMessage ? [systemMessage] : []),
      ...(lastUser ? [lastUser] : []),
    ];
  }

  if (strategy === "minimal") {
    const lastUser = [...conversation]
      .reverse()
      .find((message) => message.role === "user");
    const lastAssistant = [...conversation]
      .reverse()
      .find((message) => message.role === "assistant");
    const keep: ChatCompletionMessageParam[] = [];
    if (lastAssistant) keep.push(lastAssistant);
    if (lastUser) keep.push(lastUser);
    return [...(systemMessage ? [systemMessage] : []), ...keep];
  }

  const safeMax = Math.max(2, maxMessages);
  const windowed = conversation.slice(-safeMax);
  return [...(systemMessage ? [systemMessage] : []), ...windowed];
}

const mergeToolCallChunks = (
  chunk: ChatCompletionChunk,
  partials: Record<number, AIParsedToolCall>,
) => {
  const toolCalls = chunk.choices[0]?.delta?.tool_calls;
  if (!toolCalls || toolCalls.length === 0) return;

  toolCalls.forEach((toolCall, index) => {
    const key = toolCall.index ?? index;
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
  });
}

export const streamChatCompletion = async (
  params: StreamChatCompletionParams,
): Promise<StreamChatCompletionResult> => {
  const {
    client,
    messages,
    model,
    temperature = fallbackConfig.temperature,
    maxTokens = fallbackConfig.maxTokens,
    tools,
    onContent,
  } = params;

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    messages,
    temperature,
    max_completion_tokens: maxTokens,
    tools,
  });

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

  const toolCalls = Object.values(partialToolCalls).map((toolCall) => ({
    ...toolCall,
    parsedArguments: parseToolCallArguments(toolCall.arguments),
  }));

  return {
    content: content.trim(),
    toolCalls,
    rawResponse: content,
  };
}
