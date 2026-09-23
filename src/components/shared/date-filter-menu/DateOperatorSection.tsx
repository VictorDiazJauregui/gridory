import type { ReactNode } from "react";
import type { DateFilterOp } from "../data-model";
import { LinkToggle } from "../filter-menu/LinkToggle";
import type { DateFilterDraft } from "./use-date-filter-draft";

interface DateOperatorSectionProps {
  draft: DateFilterDraft;
}

interface OperatorToggleProps extends DateOperatorSectionProps {
  value: DateFilterOp;
  children: ReactNode;
}

const OperatorToggle = ({ value, draft, children }: OperatorToggleProps) => (
  <LinkToggle
    nowrap
    pressed={draft.tempState.op === value}
    onClick={() => draft.patch({ op: value })}
  >
    {children}
  </LinkToggle>
);

export const DateOperatorSection = ({ draft }: DateOperatorSectionProps) => (
  <div className="gdy-panel-section gdy-panel-section-stack">
    <p className="gdy-panel-title">Operador</p>
    <OperatorToggle value="gt" draft={draft}>
      Mayor que (fecha posterior)
    </OperatorToggle>
    <OperatorToggle value="lt" draft={draft}>
      Menor que (fecha anterior)
    </OperatorToggle>
    <OperatorToggle value="bt" draft={draft}>
      Entre (rango)
    </OperatorToggle>
  </div>
);
