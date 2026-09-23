import { FilterMenu } from "../../shared/toolbar";
import { buildSortMenuProps } from "./sort-menu-props";
import type { TableColumnProps } from "../model/use-table-core";

export const TableValueFilterMenu = <TData,>({
  column,
  model,
}: TableColumnProps<TData>) => {
  const { state, filterOptions } = model;
  return (
    <FilterMenu
      options={filterOptions[column.id] ?? []}
      selected={state.filters[column.id] ?? []}
      onSelectedChange={(next) => state.setFilter(column.id, next)}
      {...buildSortMenuProps(column, model)}
    />
  );
};
