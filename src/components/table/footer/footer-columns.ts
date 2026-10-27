import type { Column } from "@tanstack/react-table";
import type { ColumnDefinition, ColumnFooterContext } from "../../shared/data-model";
import { buildVisibleRowsState } from "../model/visible-rows";
import type { TableModel } from "../model/use-table-core";
import { readColumnAlignment, type ColumnAlignment } from "../model/cell-attributes";

export interface FooterColumn<TData> {
  id: string;
  alignment: ColumnAlignment;
  footer?: ColumnDefinition<TData>["footer"];
}

// Same columns as the header, in the same order (the grouped column and `_actions` included), so
// every foot cell sits under its column.
export const resolveFooterColumns = <TData>(model: TableModel<TData>): FooterColumn<TData>[] => {
  const definitions = new Map(model.settings.columns.map((column) => [column.id, column]));
  return model.table.getVisibleLeafColumns().map((column: Column<TData>) => ({
    id: column.id,
    alignment: readColumnAlignment(column.columnDef),
    footer: definitions.get(column.id)?.footer,
  }));
};

// The rows on screen, as onVisibleRowsChange reports them (printing every row included).
export const buildFooterContext = <TData>({ settings, paging, grouping }: TableModel<TData>): ColumnFooterContext<TData> =>
  buildVisibleRowsState({
    pageRows: paging.pagedRows,
    filteredRows: grouping.flatRows,
    manualPagination: settings.manualPagination,
    serverRowCount: settings.serverRowCount,
  });
