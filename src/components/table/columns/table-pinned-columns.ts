import type { Table } from "@tanstack/react-table";
import type { TableSettings } from "../settings";
import type { ColumnDefinition, ColumnPin, RowActions } from "../types";
import {
  ACTIONS_COLUMN_ID,
  ACTIONS_COLUMN_LABELED_WIDTH,
  ACTIONS_COLUMN_WIDTH,
  EXPAND_COLUMN_ID,
  EXPAND_COLUMN_WIDTH,
  SELECT_COLUMN_ID,
  SELECT_COLUMN_WIDTH,
} from "./internal-columns";
import { resolvePinnedColumns, type PinCandidate, type PinnedColumns } from "./pinned-columns";

const LEADING_INTERNAL_IDS = new Set([SELECT_COLUMN_ID, EXPAND_COLUMN_ID]);

interface CandidateContext<TData> {
  definitions: Map<string, ColumnDefinition<TData>>;
  rowActions?: RowActions<TData>;
  hasLeftPin: boolean;
  hasRightPin: boolean;
}

// The checkbox and expand columns stick with any left pin, or a pinned column would cover them; the actions
// column sticks with any right pin for the same reason, or on its own with `rowActions.pinned`.
const resolveInternalPin = <TData,>(columnId: string, context: CandidateContext<TData>): ColumnPin | undefined => {
  if (LEADING_INTERNAL_IDS.has(columnId)) return context.hasLeftPin ? "left" : undefined;
  if (columnId !== ACTIONS_COLUMN_ID) return undefined;
  return context.hasRightPin || context.rowActions?.pinned ? "right" : undefined;
};

const resolveInternalWidth = <TData,>(columnId: string, rowActions?: RowActions<TData>) => {
  if (columnId === SELECT_COLUMN_ID) return SELECT_COLUMN_WIDTH;
  if (columnId === EXPAND_COLUMN_ID) return EXPAND_COLUMN_WIDTH;
  return rowActions?.columnLabel ? ACTIONS_COLUMN_LABELED_WIDTH : ACTIONS_COLUMN_WIDTH;
};

const buildCandidate = <TData,>(columnId: string, context: CandidateContext<TData>): PinCandidate => {
  const definition = context.definitions.get(columnId);
  if (definition) return { id: columnId, width: definition.width ?? 0, pin: definition.pin };
  return {
    id: columnId,
    width: resolveInternalWidth(columnId, context.rowActions),
    pin: resolveInternalPin(columnId, context),
  };
};

/** Pinned columns of the table as it is on screen; `null` without any `pin` or `rowActions.pinned`. */
export const resolveTablePinnedColumns = <TData,>(settings: TableSettings<TData>, table: Table<TData>): PinnedColumns | null => {
  const definitions = new Map(settings.columns.map((column) => [column.id, column]));
  const columnIds = table.getVisibleLeafColumns().map((column) => column.id);
  const pins = columnIds.map((id) => definitions.get(id)?.pin);
  const context = {
    definitions,
    rowActions: settings.rowActions,
    hasLeftPin: pins.includes("left"),
    hasRightPin: pins.includes("right"),
  };
  return resolvePinnedColumns(columnIds.map((id) => buildCandidate(id, context)));
};
