import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { SelectTheme } from "../../shared/select-theme";
import { PrintValue } from "../body/PrintValue";
import { RowActionsMenu } from "../body/RowActionsMenu";
import { ACTIONS_COLUMN_ID, ACTIONS_COLUMN_WIDTH, SELECT_COLUMN_ID, SELECT_COLUMN_WIDTH } from "../columns/internal-columns";
import { RowSelectCell, type SelectCellSettings } from "../selection/RowSelectCell";
import type { RowSelectionModel } from "../selection/use-row-selection";
import type { TableSettings } from "../settings";
import { resolveActionsAlign } from "./cell-attributes";
import { TableCellContent } from "../body/TableCellContent";
import type { ColumnDefinition, DataTableLabels, RowActions } from "../types";

interface CellSettings {
  selectTheme?: SelectTheme;
  labels: DataTableLabels;
  hasPrintMode: boolean;
}

const buildDataColumn = <TData,>(
  column: ColumnDefinition<TData>,
  { selectTheme, labels, hasPrintMode }: CellSettings,
): ColumnDef<TData> => ({
  id: column.id,
  size: column.width,
  header: column.header,
  meta: { alignment: { cells: column.align, header: column.headerAlign ?? column.align } },
  cell: ({ row }) => (
    <>
      <PrintValue text={hasPrintMode ? column.printValue?.(row.original) : undefined} />
      <TableCellContent
        column={column}
        row={row.original}
        selectTheme={selectTheme}
        inlineSelectPlaceholder={labels.inlineSelectPlaceholder}
      />
    </>
  ),
});

const buildSelectColumn = <TData,>(settings: SelectCellSettings<TData>): ColumnDef<TData> => ({
  id: SELECT_COLUMN_ID,
  size: SELECT_COLUMN_WIDTH,
  header: "",
  meta: { alignment: { cells: "center", header: "center" } },
  cell: ({ row }) => <RowSelectCell row={row} {...settings} />,
});

const buildRowActionsColumn = <TData,>(
  rowActions: RowActions<TData>,
  labels: DataTableLabels,
): ColumnDef<TData> => {
  const align = resolveActionsAlign(rowActions);
  return {
    id: ACTIONS_COLUMN_ID,
    size: ACTIONS_COLUMN_WIDTH,
    header: "",
    meta: { alignment: { cells: align, header: align } },
    cell: ({ row }) => <RowActionsMenu row={row.original} actions={rowActions} align={align} labels={labels} />,
  };
};

const buildDataColumns = <TData,>(
  columns: ColumnDefinition<TData>[],
  activeGroupBy: string | null,
  cellSettings: CellSettings,
) => {
  const visibleColumns = activeGroupBy ? columns.filter((column) => column.id !== activeGroupBy) : columns;
  return visibleColumns.map((column) => buildDataColumn(column, cellSettings));
};

export const useTableColumns = <TData,>(
  settings: TableSettings<TData>,
  activeGroupBy: string | null,
  selection: RowSelectionModel<TData> | null,
) => {
  const { columns, rowActions, selectTheme, labels } = settings;
  const showRowActions = settings.flags.rowActions;
  const hasPrintMode = Boolean(settings.printMode);
  return useMemo<ColumnDef<TData>[]>(() => {
    const tableColumns = buildDataColumns(columns, activeGroupBy, { selectTheme, labels, hasPrintMode });
    if (selection) tableColumns.unshift(buildSelectColumn({ selection, labels, hasPrintMode }));
    if (showRowActions && rowActions) tableColumns.push(buildRowActionsColumn(rowActions, labels));
    return tableColumns;
  }, [columns, activeGroupBy, showRowActions, rowActions, selectTheme, labels, hasPrintMode, selection]);
};
