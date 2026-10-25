import { useMemo } from "react";
import type { TableSettings } from "../settings";
import type { TableRowConfig } from "./row-attributes";

// Built once per render of the body, not per row: the ignored ids only change with the columns.
export const useRowConfig = <TData,>(settings: TableSettings<TData>): TableRowConfig<TData> => {
  const { columns, onRowClick, getRowClassName, getRowAttributes, getRowHref, focusableRows } = settings;
  const ignoredColumnIds = useMemo(
    () => new Set(columns.filter((column) => column.ignoreRowClick).map((column) => column.id)),
    [columns],
  );
  return { onRowClick, getRowClassName, getRowAttributes, getRowHref, focusableRows, ignoredColumnIds };
};
