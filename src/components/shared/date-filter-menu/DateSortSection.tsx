import { LinkToggle } from "../filter-menu/LinkToggle";
import type { SortSectionSettings } from "../filter-menu/sort-section-settings";
import type { DateFilterMenuLabels } from "../labels/data-view-labels";

interface DateSortSectionProps {
  sort: SortSectionSettings;
  labels: Pick<DateFilterMenuLabels, "sortTitle" | "dateSortAscending" | "dateSortDescending">;
}

export const DateSortSection = ({ sort, labels }: DateSortSectionProps) => {
  const { sortable, sortDirection, onSortAsc, onSortDesc } = sort;
  if (!sortable) return null;
  return (
    <div className="gdy-panel-section gdy-panel-section-stack">
      <p className="gdy-panel-title">{labels.sortTitle}</p>
      <LinkToggle nowrap pressed={sortDirection === "asc"} onClick={onSortAsc}>
        {labels.dateSortAscending}
      </LinkToggle>
      <LinkToggle
        nowrap
        pressed={sortDirection === "desc"}
        onClick={onSortDesc}
      >
        {labels.dateSortDescending}
      </LinkToggle>
    </div>
  );
};
