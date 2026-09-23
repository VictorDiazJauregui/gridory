import { DEFAULT_TEXTS } from "./constants";
import { ActionCardButton } from "./ActionCardButton";
import type { ActionConfirmCardProps } from "./action-card-props";

export const ActionCardButtons = (props: ActionConfirmCardProps) => (
  <>
    <ActionCardButton
      variant="outline"
      className="gdy-ai-action-cancel"
      onClick={() => props.onCancel(props.action.id)}
    >
      {props.texts?.cancelCta ?? DEFAULT_TEXTS.cancelCta}
    </ActionCardButton>
    <ActionCardButton
      className="gdy-ai-action-confirm"
      onClick={() => props.onConfirm(props.action.id)}
    >
      {props.texts?.confirmCta ?? DEFAULT_TEXTS.confirmCta}
    </ActionCardButton>
  </>
);
