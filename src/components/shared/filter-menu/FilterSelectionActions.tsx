import type { FilterMenuLabels } from "../labels/data-view-labels";

interface FilterSelectionActionsProps {
  filteredCount: number;
  onSelectAll: () => void;
  onClear: () => void;
  labels: Pick<FilterMenuLabels, "filterTitle" | "selectAll" | "clearSelection">;
}

export const FilterSelectionActions = (props: FilterSelectionActionsProps) => (
  <div className="gdy-panel-section">
    <p className="gdy-panel-title">{props.labels.filterTitle}</p>
    <div className="gdy-inline-links">
      <button
        type="button"
        className="gdy-link-btn gdy-link-btn-nowrap"
        onClick={props.onSelectAll}
      >
        {props.labels.selectAll(props.filteredCount)}
      </button>
      <button type="button" className="gdy-link-btn" onClick={props.onClear}>
        {props.labels.clearSelection}
      </button>
    </div>
  </div>
);
