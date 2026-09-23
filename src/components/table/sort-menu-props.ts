import { resolveSortDirection } from "../shared/use-column-sorting";
import type { ColumnDefinition } from "./types";
import type { TableModel } from "./use-table-core";

export const buildSortMenuProps = <TData>(
  column: ColumnDefinition<TData>,
  { settings, state }: TableModel<TData>,
) => ({
  sortable: settings.flags.sorting && column.sortable !== false,
  sortDirection: resolveSortDirection(state.sorting, column.id),
  onSortAsc: () => state.toggleColumnSort(column.id, "asc"),
  onSortDesc: () => state.toggleColumnSort(column.id, "desc"),
});
