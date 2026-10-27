import type { FilterOption, SortDirection } from "../data-model";
import type { FilterMenuLabels } from "../labels/data-view-labels";
import { FilterSelectionActions } from "./FilterSelectionActions";
import { FilterSortSection } from "./FilterSortSection";
import { FilterValuesSection } from "./FilterValuesSection";
import { useFilterSelection } from "./use-filter-selection";

interface FilterMenuProps {
  options: FilterOption[];
  selected: string[];
  onSelectedChange: (next: string[]) => void;
  sortable: boolean;
  sortDirection: SortDirection | null;
  onSortAsc: () => void;
  onSortDesc: () => void;
  labels: FilterMenuLabels;
}

export const FilterMenu = (props: FilterMenuProps) => {
  const selection = useFilterSelection(props);
  return (
    <div className="gdy-panel">
      <FilterSortSection sort={props} labels={props.labels} />
      <FilterSelectionActions
        filteredCount={selection.filteredOptions.length}
        onSelectAll={selection.selectAllFiltered}
        onClear={selection.clearSelection}
        labels={props.labels}
      />
      <FilterValuesSection selection={selection} labels={props.labels} />
    </div>
  );
};
