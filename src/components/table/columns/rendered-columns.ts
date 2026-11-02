import type { TableModel } from "../model/use-table-core";
import { ACTIONS_COLUMN_ID, EXPAND_COLUMN_ID } from "./internal-columns";

// `printMode` leaves these out on paper (styles.css); a full-width cell that still counted them would stick out.
const PRINT_HIDDEN_COLUMN_IDS = new Set([ACTIONS_COLUMN_ID, EXPAND_COLUMN_ID]);

/**
 * Columns that take room: the visible ones minus the ones `responsiveColumns` hides and, while `printMode`
 * prints, the ones paper leaves out.
 */
export const countRenderedColumns = <TData,>({ table, hiddenByPriority, isPrinting }: TableModel<TData>) => {
  const columns = table.getVisibleLeafColumns();
  const printHidden = isPrinting ? columns.filter((column) => PRINT_HIDDEN_COLUMN_IDS.has(column.id)).length : 0;
  return columns.length - hiddenByPriority.length - printHidden;
};
