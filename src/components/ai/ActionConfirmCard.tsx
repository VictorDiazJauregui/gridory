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

function resolveTitle(
  action: AIPendingAction,
  entityNameSingular?: string,
): string {
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

function keyToLabel(key: string): string {
  return key
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (char) => char.toUpperCase());
}

function resolveFieldLabel(
  key: string,
  fields: AIFieldDescriptor[] | undefined,
): { label: string; required: boolean } {
  const match = fields?.find((field) => field.id === key);
  if (match) return { label: match.label, required: Boolean(match.required) };
  return { label: keyToLabel(key), required: false };
}

function toDisplayValue(value: unknown): string {
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

export function ActionConfirmCard({
  action,
  schema,
  texts,
  onConfirm,
  onCancel,
}: ActionConfirmCardProps) {
  const payloadEntries = Object.entries(action.payload ?? {});
  const title = resolveTitle(action, schema?.entityNameSingular);
  const confirmRequiredText =
    texts?.confirmRequired ?? DEFAULT_TEXTS.confirmRequired;
  const confirmCtaText = texts?.confirmCta ?? DEFAULT_TEXTS.confirmCta;
  const cancelCtaText = texts?.cancelCta ?? DEFAULT_TEXTS.cancelCta;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
      <div className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {confirmRequiredText}
        </p>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>

      <div className="space-y-1 rounded-lg border border-border/60 bg-background/80 p-2">
        {payloadEntries.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Sin datos para mostrar.
          </p>
        ) : (
          payloadEntries.map(([key, value]) => {
            const { label, required } = resolveFieldLabel(key, schema?.fields);
            return (
              <div
                key={key}
                className="grid grid-cols-[120px,1fr] gap-2 text-xs"
              >
                <span className="font-medium text-muted-foreground">
                  {label}
                  {required ? (
                    <span className="ml-0.5 text-primary">*</span>
                  ) : null}
                </span>
                <span className="break-words text-foreground">
                  {toDisplayValue(value)}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onCancel(action.id)}
        >
          {cancelCtaText}
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onConfirm(action.id)}
        >
          {confirmCtaText}
        </Button>
      </div>
    </div>
  );
}
