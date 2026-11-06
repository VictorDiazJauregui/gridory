import { useState } from "react";
import type { ColumnFiltersState, ColumnSortingState } from "../../card-grid";

const NO_FILTERS: ColumnFiltersState = { values: {}, dates: {} };

// The three views read and report the same search, filters and sort, so switching views keeps them.
export const useSharedViewState = () => {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<ColumnSortingState | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(NO_FILTERS);
  return {
    search,
    onSearchChange: setSearch,
    sorting,
    onSortChange: setSorting,
    columnFilters,
    onFiltersChange: setColumnFilters,
  };
};
