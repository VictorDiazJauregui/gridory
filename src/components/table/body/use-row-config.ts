import { useMemo } from "react";
import { EXPAND_COLUMN_ID, SELECT_COLUMN_ID } from "../columns/internal-columns";
import type { TableModel } from "../model/use-table-core";
import type { ColumnDefinition } from "../types";
import type { TableRowConfig } from "./row-attributes";

interface InternalColumnFlags {
  hasSelection: boolean;
  hasExpansion: boolean;
}

const collectIgnoredColumnIds = <TData,>(columns: ColumnDefinition<TData>[], flags: InternalColumnFlags) => {
  const ids = columns.filter((column) => column.ignoreRowClick).map((column) => column.id);
  if (flags.hasSelection) ids.push(SELECT_COLUMN_ID);
  if (flags.hasExpansion) ids.push(EXPAND_COLUMN_ID);
  return new Set(ids);
};

const useIgnoredColumnIds = <TData,>({ settings, selection, expansion }: TableModel<TData>) => {
  const { columns } = settings;
  const hasSelection = selection !== null;
  const hasExpansion = expansion !== null;
  return useMemo(
    () => collectIgnoredColumnIds(columns, { hasSelection, hasExpansion }),
    [columns, hasSelection, hasExpansion],
  );
};

// Built once per render of the body, not per row: the ignored ids only change with the columns.
export const useRowConfig = <TData,>(model: TableModel<TData>): TableRowConfig<TData> => {
  const { settings, selection, expansion, hiddenByPriority, pinnedColumns } = model;
  const { onRowClick, getRowClassName, getRowAttributes, getRowHref, focusableRows, classNames } = settings;
  const ignoredColumnIds = useIgnoredColumnIds(model);
  return {
    onRowClick,
    getRowClassName,
    getRowAttributes,
    getRowHref,
    focusableRows,
    classNames,
    ignoredColumnIds,
    selection,
    expansion,
    hiddenByPriority,
    pinnedColumns,
  };
};
