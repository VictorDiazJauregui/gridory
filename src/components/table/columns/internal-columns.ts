import type { RowActions } from "../types";

// The columns the table adds itself, in one place: features that add more (expandable rows, pinned or
// resizable columns) read the same ids and widths.
export const SELECT_COLUMN_ID = "_select";
export const SELECT_COLUMN_WIDTH = 44;
export const ACTIONS_COLUMN_ID = "_actions";
export const ACTIONS_COLUMN_WIDTH = 56;
// Pinned with `rowActions.columnLabel`: room for a short title such as "Acciones" next to the 14px paddings.
export const ACTIONS_COLUMN_LABELED_WIDTH = 96;
export const EXPAND_COLUMN_ID = "_expand";
export const EXPAND_COLUMN_WIDTH = 40;

export const resolveInternalColumnWidth = <TData,>(columnId: string, rowActions?: RowActions<TData>) => {
  if (columnId === SELECT_COLUMN_ID) return SELECT_COLUMN_WIDTH;
  if (columnId === EXPAND_COLUMN_ID) return EXPAND_COLUMN_WIDTH;
  return rowActions?.columnLabel ? ACTIONS_COLUMN_LABELED_WIDTH : ACTIONS_COLUMN_WIDTH;
};
