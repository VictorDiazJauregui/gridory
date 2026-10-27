import type { DateFilterMenuLabels } from "../labels/data-view-labels";
import type { DateFilterDraft } from "./use-date-filter-draft";

interface DateFilterActionsProps {
  draft: DateFilterDraft;
  labels: Pick<DateFilterMenuLabels, "dateClear" | "dateApply">;
}

export const DateFilterActions = ({ draft, labels }: DateFilterActionsProps) => (
  <div className="gdy-panel-actions">
    <button type="button" className="gdy-link-btn" onClick={draft.clear}>
      {labels.dateClear}
    </button>
    <button
      type="button"
      className="gdy-btn gdy-btn-primary gdy-btn-xs"
      onClick={draft.apply}
    >
      {labels.dateApply}
    </button>
  </div>
);
