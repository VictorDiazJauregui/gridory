import {
  buildDateFilterMenuKey,
  pickCalendarSettings,
  resolveEmptyDateState,
} from "../shared/column-filters";
import { DateFilterMenu } from "../shared/toolbar";
import { buildFilterSortProps } from "./filter-item";
import type { KanbanFilterItemProps } from "./filter-item";

export const KanbanDateFilterMenu = <TData,>(
  props: KanbanFilterItemProps<TData>,
) => {
  const { field, state, view } = props;
  const dateState = state.dateFilters[field.id];
  const emptyState = resolveEmptyDateState(view.dateFilterRequireOperator);
  return (
    <DateFilterMenu
      key={buildDateFilterMenuKey(field.id, dateState)}
      state={dateState ?? emptyState}
      emptyState={emptyState}
      {...pickCalendarSettings(view)}
      onChange={(next) => state.setDateFilter(field.id, next)}
      onClose={state.closeFilterMenu}
      {...buildFilterSortProps(props, state.sortBy)}
      onSortClear={() => state.clearColumnSort(field.id)}
    />
  );
};
