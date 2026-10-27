import type { Table } from "@tanstack/react-table";
import { useResolvedLabels } from "../../shared/labels/use-resolved-labels";
import { DATA_TABLE_LABELS } from "../labels";
import { resolveTableSettings } from "../settings";
import type { ColumnDefinition, DataTableProps } from "../types";
import { useTablePaging } from "../pagination/use-table-paging";
import { useTableRows } from "./use-table-rows";
import { useTableState } from "./use-table-state";
import { useFilterOptions } from "./use-filter-options";
import { useVisibleRowsChange } from "./use-visible-rows-change";
import { useBindViewPaging, useViewChangeHandlers } from "./use-view-change-handlers";

// Printing every row prints every group expanded; the user's collapsed groups come back after.
const NO_COLLAPSED_GROUPS = new Set<string>();

export const useTableCore = <TData>(props: DataTableProps<TData>) => {
  const settings = resolveTableSettings(props, useResolvedLabels(DATA_TABLE_LABELS, props.labels));
  const viewChange = useViewChangeHandlers(settings);
  const state = useTableState(settings, viewChange);
  const { rows, grouping } = useTableRows(settings, state);
  const paging = useTablePaging(grouping.flatRows, settings, state);
  useBindViewPaging(viewChange.pagingRef, paging);
  const reportedRows = paging.printingAllRows ? null : paging.pagedRows;
  useVisibleRowsChange({ pageRows: reportedRows, filteredRows: grouping.flatRows }, settings);
  const filterOptions = useFilterOptions(rows, settings, state.filters);
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
