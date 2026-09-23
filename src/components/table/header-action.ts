import type { ColumnDefinition } from "./types";
import type { TableModel } from "./use-table-core";

export const resolveHeaderAction =
  <TData>(column: ColumnDefinition<TData>, { settings, state }: TableModel<TData>) =>
  () => {
    const { flags } = settings;
    if (flags.filtering && column.filterable) {
      state.toggleFilterMenu(column.id);
      return;
    }
    if (flags.sorting && column.sortable !== false) {
      state.cycleColumnSort(column.id);
    }
  };
