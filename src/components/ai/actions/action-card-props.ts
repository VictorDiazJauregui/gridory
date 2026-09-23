import type { AIDataSchema, AIPendingAction, AITextOverrides } from "../types";

export interface ActionConfirmCardProps {
  action: AIPendingAction;
  schema?: AIDataSchema;
  texts?: AITextOverrides;
  onConfirm: (actionId: string) => void;
  onCancel: (actionId: string) => void;
}
