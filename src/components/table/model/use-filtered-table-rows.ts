import { useFilteredRows } from "../../shared/use-filtered-rows";
import { useSortedRows } from "../../shared/use-sorted-rows";
import type { TableSettings } from "../settings";
import type { TableState } from "./use-table-state";

export const useFilteredTableRows = <TData>(
  rows: TData[],
  settings: TableSettings<TData>,
  state: TableState,
) => {
  const { columns, flags } = settings;
  const { filters, dateFilters, sorting } = state;
  const filtered = useFilteredRows({
    rows,
    columns,
    filters,
    dateFilters,
    enabled: flags.filtering,
  });
  return useSortedRows({ rows: filtered, columns, sorting, enabled: flags.sorting });
};
