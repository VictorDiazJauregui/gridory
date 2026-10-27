import { useArchivedMode } from "../../shared/controls/use-archived-mode";
import { useColumnFilters } from "../../shared/controls/use-column-filters";
import { useColumnSorting } from "../../shared/controls/use-column-sorting";
import type { TableSettings } from "../settings";
import { useRowGroupingState } from "./use-row-grouping-state";
import { useTableSearch } from "./use-table-search";
import type { ViewChangeHandlers } from "./use-view-change-handlers";

export const useTableState = <TData>(
  settings: TableSettings<TData>,
  handlers: ViewChangeHandlers,
) => {
  const { search, changeSearch } = useTableSearch(settings, handlers.pagingRef);
  const columnSorting = useColumnSorting({ value: settings.sorting, onChange: handlers.handleSortChange });
  const columnFilters = useColumnFilters({ value: settings.columnFilters, onChange: handlers.handleFiltersChange });
  const rowGrouping = useRowGroupingState(settings);
  const archived = useArchivedMode(settings.archivedView);
  return {
    search,
    changeSearch,
    ...columnSorting,
    ...columnFilters,
    ...rowGrouping,
    ...archived,
  };
};

export type TableState = ReturnType<typeof useTableState>;
