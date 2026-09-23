import type { AIFieldDescriptor } from "../types";

interface ActionFieldRowProps {
  fieldKey: string;
  value: unknown;
  fields: AIFieldDescriptor[] | undefined;
}

const keyToLabel = (key: string): string => {
  return key
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (char) => char.toUpperCase());
};

const resolveFieldLabel = (
  key: string,
  fields: AIFieldDescriptor[] | undefined,
): { label: string; required: boolean } => {
  const match = fields?.find((field) => field.id === key);
  if (match) return { label: match.label, required: Boolean(match.required) };
  return { label: keyToLabel(key), required: false };
};

const toDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (Array.isArray(value))
    return value.map((item) => toDisplayValue(item)).join(", ");
  try {
    return JSON.stringify(value);
  } catch {
    return "[objeto]";
  }
};

export const ActionFieldRow = ({
  fieldKey,
  value,
  fields,
}: ActionFieldRowProps) => {
  const { label, required } = resolveFieldLabel(fieldKey, fields);
  return (
    <div className="gdy-ai-action-field">
      <span className="gdy-ai-action-field-label">
        {label}
        {required ? <span className="gdy-ai-action-required">*</span> : null}
      </span>
      <span className="gdy-ai-action-field-value">{toDisplayValue(value)}</span>
    </div>
  );
};
