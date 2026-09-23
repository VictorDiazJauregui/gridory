import { ChevronDown, Filter } from "lucide-react";
import { resolveSortDirection } from "../../shared/use-column-sorting";
import { SortIcon } from "./SortIcon";
import type { TableColumnProps } from "../model/use-table-core";

interface TableHeaderIconsProps<TData> extends TableColumnProps<TData> {
  isFiltered: boolean;
}

export const TableHeaderIcons = <TData,>({
  column,
  model,
  isFiltered,
}: TableHeaderIconsProps<TData>) => {
  const { flags } = model.settings;
  const sortable = flags.sorting && column.sortable !== false;
  return (
    <>
      {isFiltered && <Filter size={12} className="gdy-table-head-filter-icon" />}
      {flags.filtering && column.filterable && (
        <ChevronDown size={13} className="gdy-table-head-arrow" />
      )}
      {sortable && !column.filterable && (
        <SortIcon direction={resolveSortDirection(model.state.sorting, column.id)} />
      )}
    </>
  );
};
