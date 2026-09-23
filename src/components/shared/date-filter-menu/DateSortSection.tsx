import { LinkToggle } from "../filter-menu/LinkToggle";
import type { SortSectionSettings } from "../filter-menu/sort-section-settings";

interface DateSortSectionProps {
  sort: SortSectionSettings;
}

export const DateSortSection = ({ sort }: DateSortSectionProps) => {
  const { sortable, sortDirection, onSortAsc, onSortDesc } = sort;
  if (!sortable) return null;
  return (
    <div className="gdy-panel-section gdy-panel-section-stack">
      <p className="gdy-panel-title">Ordenar</p>
      <LinkToggle nowrap pressed={sortDirection === "asc"} onClick={onSortAsc}>
        Ascendente (antigua → reciente)
      </LinkToggle>
      <LinkToggle
        nowrap
        pressed={sortDirection === "desc"}
        onClick={onSortDesc}
      >
        Descendente (reciente → antigua)
      </LinkToggle>
    </div>
  );
};
