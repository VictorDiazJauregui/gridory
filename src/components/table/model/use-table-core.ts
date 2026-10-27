import { useMemo } from "react";
import type { Table } from "@tanstack/react-table";
import { computeColumnFilterOptions } from "../../shared/rows/row-pipeline";
import { resolveTableSettings } from "../settings";
import type { ColumnDefinition, DataTableProps } from "../types";
import { useTablePaging } from "../pagination/use-table-paging";
import { useTableRows } from "./use-table-rows";
import { useTableState } from "./use-table-state";
import { useVisibleRowsChange } from "./use-visible-rows-change";
import { useBindSortPaging, useSortChangeHandler } from "./use-sort-change-handler";

// Printing every row prints every group expanded; the user's collapsed groups come back after.
const NO_COLLAPSED_GROUPS = new Set<string>();

export const useTableCore = <TData>(props: DataTableProps<TData>) => {
  const settings = resolveTableSettings(props);
  const sortChange = useSortChangeHandler(settings);
  const state = useTableState(settings, sortChange.handleSortChange);
  const { rows, grouping } = useTableRows(settings, state);
  const paging = useTablePaging(grouping.flatRows, settings, state);
  useBindSortPaging(sortChange.pagingRef, paging);
  const reportedRows = paging.printingAllRows ? null : paging.pagedRows;
  useVisibleRowsChange({ pageRows: reportedRows, filteredRows: grouping.flatRows }, settings);
  const { columns } = settings;
  const filterOptions = useMemo(
    () => computeColumnFilterOptions(columns, rows),
    [columns, rows],
  );
  const printState = paging.printingAllRows ? { ...state, collapsedGroups: NO_COLLAPSED_GROUPS } : state;
  return { settings, state: printState, grouping, paging, filterOptions };
};

export type TableCore<TData> = ReturnType<typeof useTableCore<TData>>;

export type TableModel<TData> = TableCore<TData> & { table: Table<TData> };

export interface TableModelProps<TData> {
  model: TableModel<TData>;
}

export interface TableColumnProps<TData> extends TableModelProps<TData> {
  column: ColumnDefinition<TData>;
}
