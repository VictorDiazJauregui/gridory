import { useMemo } from "react";
import type { ColumnDefinition } from "./data-model";
import { applyGlobalSearch } from "./row-pipeline";

interface SearchedRowsInput<TData> {
  rows: TData[];
  columns: ColumnDefinition<TData>[];
  query: string;
  enabled: boolean;
}

export const useSearchedRows = <TData>({
  rows,
  columns,
  query,
  enabled,
}: SearchedRowsInput<TData>) =>
  useMemo(
    () => (enabled ? applyGlobalSearch({ rows, columns, query }) : rows),
    [rows, columns, query, enabled],
  );
