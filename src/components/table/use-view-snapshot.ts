import { useMemo } from "react";
import type { TableState } from "./use-table-state";

// One memoized object for the six values whose change resets the page and the
// scroll position, so both effects depend on a single value.
export const useViewSnapshot = (state: TableState) => {
  const { search, filters, dateFilters, sorting, activeGroupBy, archivedMode } =
    state;
  return useMemo(
    () => ({ search, filters, dateFilters, sorting, activeGroupBy, archivedMode }),
    [search, filters, dateFilters, sorting, activeGroupBy, archivedMode],
  );
};

export type ViewSnapshot = ReturnType<typeof useViewSnapshot>;
