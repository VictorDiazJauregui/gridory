import { FilterOptionList } from "./FilterOptionList";
import { FilterSearchInput } from "./FilterSearchInput";
import type { FilterSelection } from "./use-filter-selection";

interface FilterValuesSectionProps {
  selection: FilterSelection;
}

export const FilterValuesSection = ({
  selection,
}: FilterValuesSectionProps) => (
  <div className="gdy-panel-section">
    <p className="gdy-panel-title">Valores</p>
    <FilterSearchInput
      value={selection.search}
      onChange={selection.setSearch}
    />
    <FilterOptionList selection={selection} />
  </div>
);
