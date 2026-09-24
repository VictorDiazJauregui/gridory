import { useMemo } from "react";
import type { ColumnDefinition, ColumnSortingState } from "../data-model";
import { applyColumnSorting } from "./row-pipeline";

interface SortedRowsInput<TData> {
  rows: TData[];
  columns: ColumnDefinition<TData>[];
  sorting: ColumnSortingState | null;
  enabled: boolean;
}

export const useSortedRows = <TData>({
  rows,
  columns,
  sorting,
  enabled,
}: SortedRowsInput<TData>) =>
  useMemo(
    () => applyColumnSorting({ rows, columns, sorting, enabled }),
    [rows, columns, sorting, enabled],
  );
