import { useState } from "react";
import type { ColumnSortingState, SortDirection } from "./data-model";

export const resolveSortDirection = (
  sorting: ColumnSortingState | null,
  columnId: string,
): SortDirection | null =>
  sorting?.id === columnId ? sorting.direction : null;

const nextSortCycle = (
  previous: ColumnSortingState | null,
  columnId: string,
): ColumnSortingState | null => {
  if (!previous || previous.id !== columnId) {
    return { id: columnId, direction: "asc" };
  }
  if (previous.direction === "asc") return { id: columnId, direction: "desc" };
  return null;
};

export const useColumnSorting = () => {
  const [sorting, setSorting] = useState<ColumnSortingState | null>(null);
  const toggleColumnSort = (id: string, direction: SortDirection) =>
    setSorting((previous) =>
      previous?.id === id && previous.direction === direction
        ? null
        : { id, direction },
    );
  const cycleColumnSort = (id: string) =>
    setSorting((previous) => nextSortCycle(previous, id));
  const clearColumnSort = (id: string) =>
    setSorting((previous) => (previous?.id === id ? null : previous));
  return { sorting, toggleColumnSort, cycleColumnSort, clearColumnSort };
};
