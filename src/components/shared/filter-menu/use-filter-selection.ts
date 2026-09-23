import { useMemo, useState } from "react";
import type { FilterOption } from "../data-model";

export interface FilterSelectionOptions {
  options: FilterOption[];
  selected: string[];
  onSelectedChange: (next: string[]) => void;
}

export interface FilterSelection {
  search: string;
  setSearch: (value: string) => void;
  selectedSet: Set<string>;
  filteredOptions: FilterOption[];
  toggleSelection: (value: string) => void;
  selectAllFiltered: () => void;
  clearSelection: () => void;
}

const matchesSearch = (option: FilterOption, normalizedSearch: string) =>
  option.label.toLowerCase().includes(normalizedSearch) ||
  option.value.toLowerCase().includes(normalizedSearch);

const useFilteredOptions = (options: FilterOption[], search: string) =>
  useMemo(() => {
    if (!search.trim()) return options;
    const normalizedSearch = search.trim().toLowerCase();
    return options.filter((option) => matchesSearch(option, normalizedSearch));
  }, [options, search]);

const buildSelectionEdits = (
  { selected, onSelectedChange }: FilterSelectionOptions,
  selectedSet: Set<string>,
  filteredOptions: FilterOption[],
) => ({
  toggleSelection: (value: string) => {
    if (selectedSet.has(value)) {
      onSelectedChange(selected.filter((item) => item !== value));
      return;
    }
    onSelectedChange([...selected, value]);
  },
  selectAllFiltered: () => {
    const filteredValues = filteredOptions.map((option) => option.value);
    onSelectedChange(Array.from(new Set([...selected, ...filteredValues])));
  },
  clearSelection: () => onSelectedChange([]),
});

export const useFilterSelection = (
  props: FilterSelectionOptions,
): FilterSelection => {
  const [search, setSearch] = useState("");
  const selectedSet = useMemo(() => new Set(props.selected), [props.selected]);
  const filteredOptions = useFilteredOptions(props.options, search);
  return {
    search,
    setSearch,
    selectedSet,
    filteredOptions,
    ...buildSelectionEdits(props, selectedSet, filteredOptions),
  };
};
