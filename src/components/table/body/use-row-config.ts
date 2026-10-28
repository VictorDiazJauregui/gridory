import { useMemo } from "react";
import { SELECT_COLUMN_ID } from "../columns/internal-columns";
import type { TableModel } from "../model/use-table-core";
import type { ColumnDefinition } from "../types";
import type { TableRowConfig } from "./row-attributes";

const collectIgnoredColumnIds = <TData,>(columns: ColumnDefinition<TData>[], hasSelection: boolean) => {
  const ids = columns.filter((column) => column.ignoreRowClick).map((column) => column.id);
  return new Set(hasSelection ? [...ids, SELECT_COLUMN_ID] : ids);
};

// Built once per render of the body, not per row: the ignored ids only change with the columns.
export const useRowConfig = <TData,>({ settings, selection, hiddenByPriority }: TableModel<TData>): TableRowConfig<TData> => {
  const { columns, onRowClick, getRowClassName, getRowAttributes, getRowHref, focusableRows, classNames } = settings;
  const hasSelection = selection !== null;
  const ignoredColumnIds = useMemo(() => collectIgnoredColumnIds(columns, hasSelection), [columns, hasSelection]);
  return {
    onRowClick,
    getRowClassName,
    getRowAttributes,
    getRowHref,
    focusableRows,
    classNames,
    ignoredColumnIds,
    selection,
    hiddenByPriority,
  };
};
