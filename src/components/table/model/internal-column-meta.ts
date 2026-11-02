import type { Table } from "@tanstack/react-table";
import type { ExpandedRowsModel } from "../expansion/use-expanded-rows";
import type { RowSelectionModel } from "../selection/use-row-selection";
import type { DataTableLabels } from "../types";

/**
 * What the checkbox and expand cells read on every render. It travels in the table meta, not in the column
 * definitions: their renderers stay the same functions, so a toggle never remounts a cell and drops its focus.
 */
export interface InternalColumnMeta<TData> {
  selection: RowSelectionModel<TData> | null;
  expansion: ExpandedRowsModel<TData> | null;
  labels: DataTableLabels;
  hasPrintMode: boolean;
}

// TanStack's `meta` is typed through a global module augmentation that would leak into the consumers' types,
// so the internal cells read their own shape back through this guard.
const isInternalColumnMeta = <TData>(meta: unknown): meta is InternalColumnMeta<TData> =>
  typeof meta === "object" && meta !== null && "selection" in meta && "expansion" in meta;

export const readInternalColumnMeta = <TData>(table: Table<TData>): InternalColumnMeta<TData> | null => {
  const { meta } = table.options;
  return isInternalColumnMeta<TData>(meta) ? meta : null;
};
