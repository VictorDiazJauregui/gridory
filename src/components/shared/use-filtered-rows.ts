import { useMemo } from "react";
import type { ColumnDefinition, DateFilterState } from "./data-model";
import { applyColumnFilters } from "./row-pipeline";

interface FilteredRowsInput<TData> {
  rows: TData[];
  columns: ColumnDefinition<TData>[];
  filters: Record<string, string[]>;
  dateFilters: Record<string, DateFilterState>;
  enabled: boolean;
}

export const useFilteredRows = <TData>({
  rows,
  columns,
  filters,
  dateFilters,
  enabled,
}: FilteredRowsInput<TData>) =>
  useMemo(
    () => applyColumnFilters({ rows, columns, filters, dateFilters, enabled }),
    [rows, columns, filters, dateFilters, enabled],
  );
