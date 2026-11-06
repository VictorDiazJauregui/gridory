import type { CalendarSettings } from "../../shared/controls/column-filters";
import type { useViewControls } from "../../shared/controls/use-view-controls";
import { resolveSortDirection } from "../../shared/controls/use-column-sorting";
import type { DataViewLabels } from "../../shared/labels/data-view-labels";
import type { ColumnDefinition, FilterOption, SortDirection } from "../types";

/** What the filter row reads from the board, kept narrow so the card grid renders the same row. */
export interface FilterRowState extends ReturnType<typeof useViewControls> {
  filterOptions: Record<string, FilterOption[]>;
}

export interface FilterRowView<TData> extends CalendarSettings {
  fields: ColumnDefinition<TData>[];
  flags: { filtering: boolean; sorting: boolean };
  classNames?: { filterRow?: string };
  labels: DataViewLabels;
  dateFilterRequireOperator: boolean;
}

export interface FilterRowProps<TData> {
  state: FilterRowState;
  view: FilterRowView<TData>;
}

export interface KanbanFilterItemProps<TData> extends FilterRowProps<TData> {
  field: ColumnDefinition<TData>;
}

type SortApplier = (columnId: string, direction: SortDirection) => void;

export const buildFilterSortProps = <TData>(
  { field, state, view }: KanbanFilterItemProps<TData>,
  applySort: SortApplier,
) => ({
  sortable: view.flags.sorting && field.sortable !== false,
  sortDirection: resolveSortDirection(state.sorting, field.id),
  onSortAsc: () => applySort(field.id, "asc"),
  onSortDesc: () => applySort(field.id, "desc"),
});
