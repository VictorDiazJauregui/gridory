import { isSameRowList } from "../../shared/rows/same-row-list";
import type { VisibleRowsState } from "../types";

interface VisibleRowsInput<TData> {
  pageRows: TData[];
  filteredRows: TData[];
  manualPagination: boolean;
  serverRowCount?: number;
}

// In manual mode the table holds one page only: the server knows the real total.
export const buildVisibleRowsState = <TData>(input: VisibleRowsInput<TData>): VisibleRowsState<TData> => {
  const { pageRows, filteredRows, manualPagination, serverRowCount } = input;
  if (!manualPagination) return { pageRows, filteredRows, totalRows: filteredRows.length };
  return { pageRows, filteredRows: pageRows, totalRows: serverRowCount ?? pageRows.length };
};

export const isSameVisibleRows = <TData>(
  previous: VisibleRowsState<TData> | undefined,
  next: VisibleRowsState<TData>,
) =>
  previous !== undefined &&
  previous.totalRows === next.totalRows &&
  isSameRowList(previous.pageRows, next.pageRows) &&
  isSameRowList(previous.filteredRows, next.filteredRows);
