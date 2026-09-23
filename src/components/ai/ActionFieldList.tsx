import { ActionFieldRow } from "./ActionFieldRow";
import type { AIFieldDescriptor, AIPendingAction } from "./types";

interface ActionFieldListProps {
  payload: AIPendingAction["payload"];
  fields: AIFieldDescriptor[] | undefined;
}

export const ActionFieldList = ({ payload, fields }: ActionFieldListProps) => {
  const entries = Object.entries(payload ?? {});
  if (entries.length === 0) {
    return <p className="gdy-ai-action-empty">Sin datos para mostrar.</p>;
  }
  return entries.map(([key, value]) => (
    <ActionFieldRow key={key} fieldKey={key} value={value} fields={fields} />
  ));
};
