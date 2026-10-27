import type { FilterMenuLabels } from "../labels/data-view-labels";
import { LinkToggle } from "./LinkToggle";
import type { SortSectionSettings } from "./sort-section-settings";

interface FilterSortSectionProps {
  sort: SortSectionSettings;
  labels: Pick<FilterMenuLabels, "sortTitle" | "sortAscending" | "sortDescending">;
}

export const FilterSortSection = ({ sort, labels }: FilterSortSectionProps) => {
  const { sortable, sortDirection, onSortAsc, onSortDesc } = sort;
  if (!sortable) return null;
  return (
    <div className="gdy-panel-section gdy-panel-section-stack">
      <p className="gdy-panel-title">{labels.sortTitle}</p>
      <LinkToggle pressed={sortDirection === "asc"} onClick={onSortAsc}>
        {labels.sortAscending}
      </LinkToggle>
      <LinkToggle pressed={sortDirection === "desc"} onClick={onSortDesc}>
        {labels.sortDescending}
      </LinkToggle>
    </div>
  );
};
