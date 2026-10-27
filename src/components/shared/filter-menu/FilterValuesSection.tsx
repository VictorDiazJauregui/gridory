import type { FilterMenuLabels } from "../labels/data-view-labels";
import { FilterOptionList } from "./FilterOptionList";
import { FilterSearchInput } from "./FilterSearchInput";
import type { FilterSelection } from "./use-filter-selection";

interface FilterValuesSectionProps {
  selection: FilterSelection;
  labels: Pick<FilterMenuLabels, "valuesTitle" | "filterSearchPlaceholder" | "noResults">;
}

export const FilterValuesSection = ({
  selection,
  labels,
}: FilterValuesSectionProps) => (
  <div className="gdy-panel-section">
    <p className="gdy-panel-title">{labels.valuesTitle}</p>
    <FilterSearchInput
      value={selection.search}
      onChange={selection.setSearch}
      placeholder={labels.filterSearchPlaceholder}
    />
    <FilterOptionList selection={selection} noResults={labels.noResults} />
  </div>
);
