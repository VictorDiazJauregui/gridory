import { FilterOptionItem } from "./FilterOptionItem";
import type { FilterSelection } from "./use-filter-selection";

interface FilterOptionListProps {
  selection: FilterSelection;
  noResults: string;
}

export const FilterOptionList = ({ selection, noResults }: FilterOptionListProps) => (
  <div className="gdy-option-list gdy-scroll">
    {selection.filteredOptions.length === 0 ? (
      <p className="gdy-empty-sm">{noResults}</p>
    ) : (
      selection.filteredOptions.map((option) => (
        <FilterOptionItem
          key={option.value}
          option={option}
          checked={selection.selectedSet.has(option.value)}
          onToggle={selection.toggleSelection}
        />
      ))
    )}
  </div>
);
