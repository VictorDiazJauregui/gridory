import { createId } from "../chat/create-id";
import { applyFixedValues } from "./pending-actions";
import type {
  AIActionType,
  AIChatMode,
  AIDataSchema,
  AIPendingAction,
} from "../types";

const extractJsonBlock = (content: string): string | null => {
  const fencedMatch = content.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();

  const objectMatch = content.match(/\{[\s\S]*\}/);
  return objectMatch?.[0] ? objectMatch[0].trim() : null;
};

const CREATE_ALIASES = new Set(["create-row", "create_record", "create"]);
const ACTION_TYPE_BY_ALIAS: Record<string, AIActionType> = {
  "create-card": "create-card",
  "update-row": "update-row",
  update_record: "update-row",
  "move-card": "move-card",
  move_card: "move-card",
};

const createActionTypeFor = (mode: AIChatMode): AIActionType =>
  mode === "kanban" ? "create-card" : "create-row";

const resolveActionTypeFromAlias = (
  rawType: string,
  mode: AIChatMode,
): AIActionType => {
  if (CREATE_ALIASES.has(rawType)) return createActionTypeFor(mode);
  return ACTION_TYPE_BY_ALIAS[rawType] ?? "custom";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const inferActionTypeFromShape = (
  parsed: Record<string, unknown>,
  mode: AIChatMode,
): AIActionType => {
  if (isRecord(parsed.record)) return createActionTypeFor(mode);
  if (isRecord(parsed.updates)) return "update-row";
  const hasTargetColumn =
    typeof parsed.targetColumn === "string" ||
    typeof parsed.target_column === "string";
  if (hasTargetColumn && typeof parsed.id === "string") return "move-card";
  return "custom";
};

const parseJsonRecord = (raw: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
};

export const parseFallbackAction = (
  content: string,
  mode: AIChatMode,
): AIPendingAction | null => {
  const jsonRaw = extractJsonBlock(content);
  const parsed = jsonRaw ? parseJsonRecord(jsonRaw) : null;
  if (!parsed) return null;

  const rawType = String(parsed.type ?? parsed.action ?? "").toLowerCase();
  const type = rawType
    ? resolveActionTypeFromAlias(rawType, mode)
    : inferActionTypeFromShape(parsed, mode);
  const payload =
    (parsed.payload as Record<string, unknown> | undefined) ??
    (parsed.record as Record<string, unknown> | undefined) ??
    parsed;

  return { id: `fallback-${createId()}`, type, mode, payload, rawResponse: content };
};

export interface FallbackContext {
  enableActions: boolean;
  mode: AIChatMode;
  schema?: AIDataSchema;
}

export const resolveFallbackActions = (
  content: string,
  { enableActions, mode, schema }: FallbackContext,
): AIPendingAction[] => {
  if (!enableActions) return [];
  const action = parseFallbackAction(content, mode);
  if (!action) return [];
  return [{ ...action, payload: applyFixedValues(action.payload, schema) }];
};
