import {
  buildDateFilterMenuKey,
  pickCalendarSettings,
  resolveEmptyDateState,
} from "../../shared/controls/column-filters";
import { DateFilterMenu } from "../../shared/date-filter-menu/DateFilterMenu";
import { buildSortMenuProps } from "./sort-menu-props";
import type { TableColumnProps } from "../model/use-table-core";

export const TableDateFilterMenu = <TData,>({
  column,
  model,
}: TableColumnProps<TData>) => {
  const { settings, state } = model;
  const dateState = state.dateFilters[column.id];
  const emptyState = resolveEmptyDateState(settings.dateFilterRequireOperator);
  return (
    <DateFilterMenu
      key={buildDateFilterMenuKey(column.id, dateState)}
      state={dateState ?? emptyState}
      emptyState={emptyState}
      {...pickCalendarSettings(settings)}
      onChange={(next) => state.setDateFilter(column.id, next)}
      onClose={state.closeFilterMenu}
      {...buildSortMenuProps(column, model)}
      onSortClear={() => state.clearColumnSort(column.id)}
    />
  );
};
