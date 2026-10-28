import type { TableModel } from "../model/use-table-core";

/** Columns that take room on screen: the visible ones minus the ones `responsiveColumns` hides. */
export const countRenderedColumns = <TData,>({ table, hiddenByPriority }: TableModel<TData>) =>
  table.getVisibleLeafColumns().length - hiddenByPriority.length;
