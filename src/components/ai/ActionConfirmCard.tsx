import { Button } from "../ui/button";
import { DEFAULT_TEXTS } from "./constants";
import type {
  AIDataSchema,
  AIFieldDescriptor,
  AIPendingAction,
  AITextOverrides,
} from "./types";

interface ActionConfirmCardProps {
  action: AIPendingAction;
  schema?: AIDataSchema;
  texts?: AITextOverrides;
  onConfirm: (actionId: string) => void;
  onCancel: (actionId: string) => void;
}

const resolveTitle = (
  action: AIPendingAction,
  entityNameSingular?: string,
): string => {
  const entity = entityNameSingular ?? "registro";
  if (action.type === "create-row" || action.type === "create-card") {
    return `Crear nuevo ${entity}`;
  }
  if (action.type === "update-row") {
    return `Actualizar ${entity}`;
  }
  if (action.type === "move-card") {
    return `Mover ${entity}`;
  }
  return "Acción personalizada";
}

const keyToLabel = (key: string): string => {
  return key
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (char) => char.toUpperCase());
}

const resolveFieldLabel = (
  key: string,
  fields: AIFieldDescriptor[] | undefined,
): { label: string; required: boolean } => {
  const match = fields?.find((field) => field.id === key);
  if (match) return { label: match.label, required: Boolean(match.required) };
  return { label: keyToLabel(key), required: false };
}

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
}

export const ActionConfirmCard = ({
  action,
  schema,
  texts,
  onConfirm,
  onCancel,
}: ActionConfirmCardProps) => {
  const payloadEntries = Object.entries(action.payload ?? {});
  const title = resolveTitle(action, schema?.entityNameSingular);
  const confirmRequiredText =
    texts?.confirmRequired ?? DEFAULT_TEXTS.confirmRequired;
  const confirmCtaText = texts?.confirmCta ?? DEFAULT_TEXTS.confirmCta;
  const cancelCtaText = texts?.cancelCta ?? DEFAULT_TEXTS.cancelCta;

  return (
    <div className="gdy-ai-action-card" data-action-type={action.type}>
      <div className="gdy-ai-action-header">
        <p className="gdy-ai-action-kicker">{confirmRequiredText}</p>
        <h4 className="gdy-ai-action-title">{title}</h4>
      </div>

      <div className="gdy-ai-action-fields">
        {payloadEntries.length === 0 ? (
          <p className="gdy-ai-action-empty">Sin datos para mostrar.</p>
        ) : (
          payloadEntries.map(([key, value]) => {
            const { label, required } = resolveFieldLabel(key, schema?.fields);
            return (
              <div key={key} className="gdy-ai-action-field">
                <span className="gdy-ai-action-field-label">
                  {label}
                  {required ? (
                    <span className="gdy-ai-action-required">*</span>
                  ) : null}
                </span>
                <span className="gdy-ai-action-field-value">
                  {toDisplayValue(value)}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="gdy-ai-action-actions">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gdy-ai-action-cancel"
          onClick={() => onCancel(action.id)}
        >
          {cancelCtaText}
        </Button>
        <Button
          type="button"
          size="sm"
          className="gdy-ai-action-confirm"
          onClick={() => onConfirm(action.id)}
        >
          {confirmCtaText}
        </Button>
      </div>
    </div>
  );
}
