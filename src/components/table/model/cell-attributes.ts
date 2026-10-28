import type { CSSProperties } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PinnedColumns } from "../columns/pinned-columns";
import type { ColumnAlign, RowActions } from "../types";

/** What the table decided about its columns on screen: the ones the priority hid and the pinned ones. */
export interface ColumnLayout {
  hiddenByPriority: readonly string[];
  pinnedColumns: PinnedColumns | null;
}

// The offset travels as a custom property, not as `left`/`right`: the sticky rules (and printing, which drops
// them) decide whether it applies.
const buildPinAttributes = (columnId: string, pinnedColumns: PinnedColumns | null | undefined) => {
  const placement = pinnedColumns?.placements.get(columnId);
  if (!placement) return {};
  return {
    "data-pinned": placement.side,
    "data-pinned-edge": placement.isEdge ? true : undefined,
    style: { "--gdy-table-pin-offset": `${placement.offset}px` } as CSSProperties,
  };
};

// Single source of the attributes every header and data cell of a column carries,
// so the column hooks added later (alignment, overflow) land on th and td together.
export const buildCellAttributes = (columnId: string, align?: ColumnAlign, layout?: ColumnLayout) => ({
  "data-column-id": columnId,
  "data-align": align,
  "data-hidden-by": layout?.hiddenByPriority.includes(columnId) ? "priority" : undefined,
  ...buildPinAttributes(columnId, layout?.pinnedColumns),
});

export type CellAttributes = ReturnType<typeof buildCellAttributes>;

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
