import { DEFAULT_TEXTS } from "./constants";
import { ActionCardButtons } from "./ActionCardButtons";
import { ActionFieldList } from "./ActionFieldList";
import type { ActionConfirmCardProps } from "./action-card-props";
import type { AIPendingAction } from "./types";

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
};

export const ActionConfirmCard = (props: ActionConfirmCardProps) => {
  const { action, schema, texts } = props;
  const title = resolveTitle(action, schema?.entityNameSingular);
  const kicker = texts?.confirmRequired ?? DEFAULT_TEXTS.confirmRequired;
  return (
    <div className="gdy-ai-action-card" data-action-type={action.type}>
      <div className="gdy-ai-action-header">
        <p className="gdy-ai-action-kicker">{kicker}</p>
        <h4 className="gdy-ai-action-title">{title}</h4>
      </div>
      <div className="gdy-ai-action-fields">
        <ActionFieldList payload={action.payload} fields={schema?.fields} />
      </div>
      <div className="gdy-ai-action-actions">
        <ActionCardButtons {...props} />
      </div>
    </div>
  );
};
