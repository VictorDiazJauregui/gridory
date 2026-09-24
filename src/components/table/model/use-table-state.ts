import { useState } from "react";
import { useArchivedMode } from "../../shared/controls/use-archived-mode";
import { useColumnFilters } from "../../shared/controls/use-column-filters";
import { useColumnSorting } from "../../shared/controls/use-column-sorting";
import type { TableSettings } from "../settings";
import { useRowGroupingState } from "./use-row-grouping-state";

export const useTableState = <TData>(settings: TableSettings<TData>) => {
  const [search, setSearch] = useState("");
  const columnSorting = useColumnSorting();
  const columnFilters = useColumnFilters();
  const rowGrouping = useRowGroupingState(settings);
  const archived = useArchivedMode(settings.archivedView);
  return {
    search,
    setSearch,
    ...columnSorting,
    ...columnFilters,
    ...rowGrouping,
    ...archived,
  };
};

export type TableState = ReturnType<typeof useTableState>;
