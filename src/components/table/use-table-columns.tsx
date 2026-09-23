import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "../../lib/cn";
import { normalizeToArray } from "../shared/row-pipeline";
import type { SelectTheme } from "../shared/select-theme";
import { SimpleSelect } from "../ui/select";
import { RowActionsMenu } from "./RowActionsMenu";
import type { TableSettings } from "./settings";
import type { ColumnDefinition, RowActions } from "./types";

const renderCellValue = <TData,>(
  column: ColumnDefinition<TData>,
  row: TData,
) => {
  if (column.cell) return column.cell(row);
  return String(normalizeToArray(column.accessor(row)).join(", ") || "—");
};

const buildDataColumn = <TData,>(
  column: ColumnDefinition<TData>,
  selectTheme?: SelectTheme,
): ColumnDef<TData> => ({
  id: column.id,
  size: column.width,
  header: column.header,
  cell: ({ row }) => {
    const value = normalizeToArray(column.accessor(row.original))[0] ?? "";
    const valueHighlight = column.valueHighlights?.[value];
    const canInlineEdit = Boolean(
      column.inlineEditOptions?.length && column.onInlineEdit,
    );
    const inlineOptions = column.inlineEditOptions ?? [];
    const inlineValueExists = inlineOptions.some(
      (option) => option.value === value,
    );

    return (
      <div className={cn("gdy-table-cell-content", valueHighlight?.className)}>
        {canInlineEdit ? (
          <div
            className="gdy-table-inline-select-wrap"
            onClick={(event) => event.stopPropagation()}
          >
            <SimpleSelect
              options={inlineOptions}
              value={inlineValueExists ? String(value) : ""}
              onValueChange={(next) =>
                column.onInlineEdit?.(row.original, next)
              }
              placeholder="Seleccionar..."
              triggerClassName="gdy-table-inline-select"
              triggerStyle={valueHighlight?.style}
              theme={selectTheme}
            />
          </div>
        ) : (
          renderCellValue(column, row.original)
        )}
      </div>
    );
  },
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
