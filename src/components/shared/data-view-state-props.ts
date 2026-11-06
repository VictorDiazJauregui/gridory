import type { ColumnFiltersState, ColumnSortingState } from "./data-model";

/** Search, sort and filters the app can own, with the same names and rules as in `DataTable`. */
export interface DataViewStateProps {
  /**
   * Controlled search query shown in the search box. Pass it together with `onSearchChange`, which
   * only reports what the user types (not the changes of this prop).
   */
  search?: string;
  /** Reports what the user types in the search box, controlled or not. */
  onSearchChange?: (query: string) => void;
  /**
   * Controlled sort. Pass it together with `onSortChange` to own the sort; `null` means no sort.
   * Leave it `undefined` to keep the sort inside. Switching modes after mounting logs a development warning.
   */
  sorting?: ColumnSortingState | null;
  /** Fires on every sort change made by the user in a filter menu, controlled or not, with the next sort or `null`. */
  onSortChange?: (sorting: ColumnSortingState | null) => void;
  /**
   * Controlled column filters (value and date filters). Pass it together with `onFiltersChange` to
   * own them. Leave it `undefined` to keep them inside.
   */
  columnFilters?: ColumnFiltersState;
  /**
   * Fires when the user changes the active filters (a value menu, a date menu, "Clear filters"),
   * controlled or not. It receives only the active ones: no empty selection, no incomplete date filter.
   */
  onFiltersChange?: (filters: ColumnFiltersState) => void;
}
