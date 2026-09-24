import type { FilterOption, SortDirection } from "../data-model";
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
}

export const FilterMenu = (props: FilterMenuProps) => {
  const selection = useFilterSelection(props);
  return (
    <div className="gdy-panel">
      <FilterSortSection sort={props} />
      <FilterSelectionActions
        filteredCount={selection.filteredOptions.length}
        onSelectAll={selection.selectAllFiltered}
        onClear={selection.clearSelection}
      />
      <FilterValuesSection selection={selection} />
    </div>
  );
};
