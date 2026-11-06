import type { ColumnDefinition, RowActions } from "../types";
import { resolveInternalColumnWidth } from "./internal-columns";

/** Narrowest width of a column without `width` when `minWidth` does not set one. */
export const DEFAULT_AUTO_COLUMN_MIN_WIDTH = 120;

export interface MinimumWidthSources<TData> {
  columns: ColumnDefinition<TData>[];
  rowActions?: RowActions<TData>;
}

const resolveMinimumColumnWidth = <TData,>(columnId: string, sources: MinimumWidthSources<TData>) => {
  const definition = sources.columns.find((column) => column.id === columnId);
  if (!definition) return resolveInternalColumnWidth(columnId, sources.rowActions);
  return definition.width ?? definition.minWidth ?? DEFAULT_AUTO_COLUMN_MIN_WIDTH;
};

/** Width under which the grid stops shrinking its columns and the rows scroll sideways instead. */
export const sumMinimumColumnWidths = <TData,>(columnIds: readonly string[], sources: MinimumWidthSources<TData>) =>
  columnIds.reduce((sum, columnId) => sum + resolveMinimumColumnWidth(columnId, sources), 0);
