import type { AIParsedToolCall } from "./ai-client";
import { createId } from "./create-id";
import type {
  AIActionEvent,
  AIChatMode,
  AIDataSchema,
  AIPendingAction,
} from "./types";

type ToolCallArguments = Record<string, unknown>;

type ResolvedPayload = Pick<AIPendingAction, "type" | "payload">;

export interface ToolCallActionInput {
  toolCall: AIParsedToolCall;
  rawResponse: string;
  mode: AIChatMode;
  schema?: AIDataSchema;
}

export const applyFixedValues = (
  payload: Record<string, unknown>,
  schema?: AIDataSchema,
): Record<string, unknown> => {
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
};

const createRecordPayload = (
  args: ToolCallArguments,
  mode: AIChatMode,
  schema?: AIDataSchema,
): ResolvedPayload => {
  const record = (args.record as ToolCallArguments | undefined) ?? args ?? {};
  return {
    type: mode === "kanban" ? "create-card" : "create-row",
    payload: applyFixedValues(record, schema),
  };
};

const updateRecordPayload = (
  args: ToolCallArguments,
  schema?: AIDataSchema,
): ResolvedPayload => {
  const updates = (args.updates as ToolCallArguments | undefined) ?? {};
  return {
    type: "update-row",
    payload: { id: args.id, ...applyFixedValues(updates, schema) },
  };
};

const resolveToolCallPayload = (
  toolCall: AIParsedToolCall,
  mode: AIChatMode,
  schema?: AIDataSchema,
): ResolvedPayload | null => {
  const args = toolCall.parsedArguments ?? {};
  if (toolCall.name === "create_record") {
    return createRecordPayload(args, mode, schema);
  }
  if (toolCall.name === "update_record") {
    return updateRecordPayload(args, schema);
  }
  if (toolCall.name === "move_card") {
    return { type: "move-card", payload: args };
  }
  if (Object.keys(args).length > 0) return { type: "custom", payload: args };
  return null;
};

export const mapToolCallToAction = ({
  toolCall,
  rawResponse,
  mode,
  schema,
}: ToolCallActionInput): AIPendingAction | null => {
  const resolved = resolveToolCallPayload(toolCall, mode, schema);
  if (!resolved) return null;
  return {
    id: toolCall.id || `action-${createId()}`,
    type: resolved.type,
    mode,
    payload: resolved.payload,
    rawResponse,
  };
};

export const toActionEvent = (action: AIPendingAction): AIActionEvent => ({
  type: action.type,
  mode: action.mode,
  payload: action.payload,
  rawResponse: action.rawResponse,
});
