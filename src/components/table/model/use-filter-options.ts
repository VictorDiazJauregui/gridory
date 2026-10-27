import { useMemo } from "react";
import type { ColumnDefinition, FilterOption } from "../../shared/data-model";
import { computeColumnFilterOptions } from "../../shared/rows/row-pipeline";
import type { TableSettings } from "../settings";

type FilterOptionsById = Record<string, FilterOption[]>;

const withSelectedValues = (options: FilterOption[], selected: string[] = []) => {
  const missing = selected.filter((value) => !options.some((option) => option.value === value));
  if (missing.length === 0) return options;
  return [...options, ...missing.map((value) => ({ value, label: value }))].sort((first, second) =>
    first.label.localeCompare(second.label, "es"),
  );
};

// With server-side filtering the loaded rows are already filtered (and one page only): a value the
// user selected may be missing from them, and without it the user could not unselect it.
const addSelectedValues = <TData>(
  options: FilterOptionsById,
  columns: ColumnDefinition<TData>[],
  filters: Record<string, string[]>,
): FilterOptionsById => {
  const merged = { ...options };
  columns.forEach((column) => {
    if (!merged[column.id] || column.filterOptions?.length) return;
    merged[column.id] = withSelectedValues(merged[column.id], filters[column.id]);
  });
  return merged;
};

export const useFilterOptions = <TData>(
  rows: TData[],
  settings: TableSettings<TData>,
  filters: Record<string, string[]>,
) => {
  const { columns, manualFiltering } = settings;
  return useMemo(() => {
    const options = computeColumnFilterOptions(columns, rows);
    return manualFiltering ? addSelectedValues(options, columns, filters) : options;
  }, [columns, rows, manualFiltering, filters]);
};
