import type { ColumnDef } from "@tanstack/react-table";
import type { ColumnAlign, RowActions } from "../types";

// Single source of the attributes every header and data cell of a column carries,
// so the column hooks added later (alignment, overflow) land on th and td together.
export const buildCellAttributes = (columnId: string, align?: ColumnAlign) => ({
  "data-column-id": columnId,
  "data-align": align,
});

/** Alignment of a column's cells and of its header, kept apart so each can differ. */
export interface ColumnAlignment {
  cells?: ColumnAlign;
  header?: ColumnAlign;
}

// TanStack's `meta` is typed through a global module augmentation; that would leak into
// the consumers' types, so the table reads its own shape back through this guard.
const isColumnAlignment = (meta: unknown): meta is { alignment: ColumnAlignment } =>
  typeof meta === "object" && meta !== null && "alignment" in meta;

export const readColumnAlignment = <TData,>(columnDef: ColumnDef<TData>): ColumnAlignment =>
  isColumnAlignment(columnDef.meta) ? columnDef.meta.alignment : {};

export const resolveActionsAlign = <TData,>(rowActions: RowActions<TData>) => {
  if (rowActions.align) return rowActions.align;
  return rowActions.columnLabel ? "right" : undefined;
};
