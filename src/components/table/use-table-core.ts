import { useMemo } from "react";
import type { Table } from "@tanstack/react-table";
import { computeColumnFilterOptions } from "../shared/row-pipeline";
import { resolveTableSettings } from "./settings";
import type { DataTableProps } from "./types";
import { useTablePaging } from "./use-table-paging";
import { useTableRows } from "./use-table-rows";
import { useTableState } from "./use-table-state";

export const useTableCore = <TData>(props: DataTableProps<TData>) => {
  const settings = resolveTableSettings(props);
  const state = useTableState(settings);
  const { rows, grouping } = useTableRows(settings, state);
  const paging = useTablePaging(grouping.flatRows, settings, state);
  const { columns } = settings;
  const filterOptions = useMemo(
    () => computeColumnFilterOptions(columns, rows),
    [columns, rows],
  );
  return { settings, state, grouping, paging, filterOptions };
};

export type TableCore<TData> = ReturnType<typeof useTableCore<TData>>;

export type TableModel<TData> = TableCore<TData> & { table: Table<TData> };
