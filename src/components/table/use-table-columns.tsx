import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { SelectTheme } from "../shared/select-theme";
import { RowActionsMenu } from "./RowActionsMenu";
import type { TableSettings } from "./settings";
import { TableCellContent } from "./TableCellContent";
import type { ColumnDefinition, RowActions } from "./types";

const buildDataColumn = <TData,>(
  column: ColumnDefinition<TData>,
  selectTheme?: SelectTheme,
): ColumnDef<TData> => ({
  id: column.id,
  size: column.width,
  header: column.header,
  cell: ({ row }) => (
    <TableCellContent
      column={column}
      row={row.original}
      selectTheme={selectTheme}
    />
  ),
});

const buildRowActionsColumn = <TData,>(
  rowActions: RowActions<TData>,
): ColumnDef<TData> => ({
  id: "_actions",
  size: 56,
  header: "",
  cell: ({ row }) => <RowActionsMenu row={row.original} actions={rowActions} />,
});

export const useTableColumns = <TData,>(
  settings: TableSettings<TData>,
  activeGroupBy: string | null,
) => {
  const { columns, rowActions, selectTheme } = settings;
  const showRowActions = settings.flags.rowActions;
  return useMemo<ColumnDef<TData>[]>(() => {
    const visibleColumns = activeGroupBy
      ? columns.filter((column) => column.id !== activeGroupBy)
      : columns;
    const tableColumns = visibleColumns.map((column) =>
      buildDataColumn(column, selectTheme),
    );
    if (showRowActions && rowActions) {
      tableColumns.push(buildRowActionsColumn(rowActions));
    }
    return tableColumns;
  }, [columns, activeGroupBy, showRowActions, rowActions, selectTheme]);
};
