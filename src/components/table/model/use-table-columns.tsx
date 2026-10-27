import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { SelectTheme } from "../../shared/select-theme";
import { RowActionsMenu } from "../body/RowActionsMenu";
import type { TableSettings } from "../settings";
import { resolveActionsAlign } from "./cell-attributes";
import { TableCellContent } from "../body/TableCellContent";
import type { ColumnDefinition, DataTableLabels, RowActions } from "../types";

interface CellSettings {
  selectTheme?: SelectTheme;
  labels: DataTableLabels;
}

const buildDataColumn = <TData,>(
  column: ColumnDefinition<TData>,
  { selectTheme, labels }: CellSettings,
): ColumnDef<TData> => ({
  id: column.id,
  size: column.width,
  header: column.header,
  meta: { alignment: { cells: column.align, header: column.headerAlign ?? column.align } },
  cell: ({ row }) => (
    <TableCellContent
      column={column}
      row={row.original}
      selectTheme={selectTheme}
      inlineSelectPlaceholder={labels.inlineSelectPlaceholder}
    />
  ),
});

const buildRowActionsColumn = <TData,>(
  rowActions: RowActions<TData>,
  labels: DataTableLabels,
): ColumnDef<TData> => {
  const align = resolveActionsAlign(rowActions);
  return {
    id: "_actions",
    size: 56,
    header: "",
    meta: { alignment: { cells: align, header: align } },
    cell: ({ row }) => <RowActionsMenu row={row.original} actions={rowActions} align={align} labels={labels} />,
  };
};

export const useTableColumns = <TData,>(
  settings: TableSettings<TData>,
  activeGroupBy: string | null,
) => {
  const { columns, rowActions, selectTheme, labels } = settings;
  const showRowActions = settings.flags.rowActions;
  return useMemo<ColumnDef<TData>[]>(() => {
    const visibleColumns = activeGroupBy
      ? columns.filter((column) => column.id !== activeGroupBy)
      : columns;
    const tableColumns = visibleColumns.map((column) =>
      buildDataColumn(column, { selectTheme, labels }),
    );
    if (showRowActions && rowActions) {
      tableColumns.push(buildRowActionsColumn(rowActions, labels));
    }
    return tableColumns;
  }, [columns, activeGroupBy, showRowActions, rowActions, selectTheme, labels]);
};
