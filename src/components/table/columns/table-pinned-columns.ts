import type { Table } from "@tanstack/react-table";
import type { TableSettings } from "../settings";
import type { ColumnDefinition, ColumnPin, RowActions } from "../types";
import { ACTIONS_COLUMN_ID, EXPAND_COLUMN_ID, SELECT_COLUMN_ID, resolveInternalColumnWidth } from "./internal-columns";
import { resolvePinnedColumns, type PinCandidate, type PinnedColumns } from "./pinned-columns";

const LEADING_INTERNAL_IDS = new Set([SELECT_COLUMN_ID, EXPAND_COLUMN_ID]);

interface CandidateContext<TData> {
  definitions: Map<string, ColumnDefinition<TData>>;
  rowActions?: RowActions<TData>;
  hasLeftPin: boolean;
  hasRightPin: boolean;
  /** The resized layout's widths, the user's included; `null` keeps the declared ones. */
  layoutWidths: ReadonlyMap<string, number> | null;
}

// The checkbox and expand columns stick with any left pin, or a pinned column would cover them; the actions
// column sticks with any right pin for the same reason, or on its own with `rowActions.pinned`.
const resolveInternalPin = <TData,>(columnId: string, context: CandidateContext<TData>): ColumnPin | undefined => {
  if (LEADING_INTERNAL_IDS.has(columnId)) return context.hasLeftPin ? "left" : undefined;
  if (columnId !== ACTIONS_COLUMN_ID) return undefined;
  return context.hasRightPin || context.rowActions?.pinned ? "right" : undefined;
};

const buildCandidate = <TData,>(columnId: string, context: CandidateContext<TData>): PinCandidate => {
  const definition = context.definitions.get(columnId);
  const layoutWidth = context.layoutWidths?.get(columnId);
  if (definition) return { id: columnId, width: layoutWidth ?? definition.width ?? 0, pin: definition.pin };
  return {
    id: columnId,
    width: layoutWidth ?? resolveInternalColumnWidth(columnId, context.rowActions),
    pin: resolveInternalPin(columnId, context),
  };
};

/** Pinned columns of the table as it is on screen; `null` without any `pin` or `rowActions.pinned`. */
export const resolveTablePinnedColumns = <TData,>(
  settings: TableSettings<TData>,
  table: Table<TData>,
  layoutWidths: ReadonlyMap<string, number> | null,
): PinnedColumns | null => {
  const definitions = new Map(settings.columns.map((column) => [column.id, column]));
  const columnIds = table.getVisibleLeafColumns().map((column) => column.id);
  const pins = columnIds.map((id) => definitions.get(id)?.pin);
  const context = {
    definitions,
    rowActions: settings.rowActions,
    hasLeftPin: pins.includes("left"),
    hasRightPin: pins.includes("right"),
    layoutWidths,
  };
  return resolvePinnedColumns(columnIds.map((id) => buildCandidate(id, context)));
};
