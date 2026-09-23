import { resolveSortDirection } from "../../shared/use-column-sorting";
import type { ColumnDefinition, SortDirection } from "../types";
import type { KanbanSectionProps } from "../model/use-kanban-board-state";

export interface KanbanFilterItemProps<TData>
  extends KanbanSectionProps<TData> {
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
