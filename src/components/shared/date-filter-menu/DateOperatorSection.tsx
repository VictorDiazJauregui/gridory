import type { ReactNode } from "react";
import type { DateFilterOp } from "../data-model";
import { LinkToggle } from "../filter-menu/LinkToggle";
import type { DateFilterMenuLabels } from "../labels/data-view-labels";
import type { DateFilterDraft } from "./use-date-filter-draft";

interface DateOperatorSectionProps {
  draft: DateFilterDraft;
  labels: Pick<DateFilterMenuLabels, "operatorTitle" | "operatorAfter" | "operatorBefore" | "operatorBetween">;
}

interface OperatorToggleProps {
  value: DateFilterOp;
  draft: DateFilterDraft;
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

export const DateOperatorSection = ({ draft, labels }: DateOperatorSectionProps) => (
  <div className="gdy-panel-section gdy-panel-section-stack">
    <p className="gdy-panel-title">{labels.operatorTitle}</p>
    <OperatorToggle value="gt" draft={draft}>
      {labels.operatorAfter}
    </OperatorToggle>
    <OperatorToggle value="lt" draft={draft}>
      {labels.operatorBefore}
    </OperatorToggle>
    <OperatorToggle value="bt" draft={draft}>
      {labels.operatorBetween}
    </OperatorToggle>
  </div>
);
