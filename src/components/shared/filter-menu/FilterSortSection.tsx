import { LinkToggle } from "./LinkToggle";
import type { SortSectionSettings } from "./sort-section-settings";

interface FilterSortSectionProps {
  sort: SortSectionSettings;
}

export const FilterSortSection = ({ sort }: FilterSortSectionProps) => {
  const { sortable, sortDirection, onSortAsc, onSortDesc } = sort;
  if (!sortable) return null;
  return (
    <div className="gdy-panel-section gdy-panel-section-stack">
      <p className="gdy-panel-title">Ordenar</p>
      <LinkToggle pressed={sortDirection === "asc"} onClick={onSortAsc}>
        Ascendente (A → Z)
      </LinkToggle>
      <LinkToggle pressed={sortDirection === "desc"} onClick={onSortDesc}>
        Descendente (Z → A)
      </LinkToggle>
    </div>
  );
};
