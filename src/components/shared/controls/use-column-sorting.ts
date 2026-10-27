import type { ColumnSortingState, SortDirection } from "../data-model";
import { useControllableState } from "../state/use-controllable-state";

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

export interface ColumnSortingControl {
  /** Controlled sort; `undefined` keeps it internal, `null` means "no sort". */
  value?: ColumnSortingState | null;
  onChange?: (sorting: ColumnSortingState | null) => void;
}

export const useColumnSorting = (control: ColumnSortingControl = {}) => {
  const [sorting, setSorting] = useControllableState<ColumnSortingState | null>({
    ...control, defaultValue: null, name: "sorting",
  });
  const sortBy = (id: string, direction: SortDirection) =>
    setSorting({ id, direction });
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
  return { sorting, sortBy, toggleColumnSort, cycleColumnSort, clearColumnSort };
};
