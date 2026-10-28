import type { Row } from "@tanstack/react-table";
import { pickConsumerAttributes } from "../../shared/attributes/consumer-attributes";
import type { RowSelectionModel } from "../selection/use-row-selection";
import type { DataTableProps } from "../types";

export type TableRowConfig<TData> = Pick<
  DataTableProps<TData>,
  "onRowClick" | "getRowClassName" | "getRowAttributes" | "getRowHref" | "focusableRows" | "classNames"
> & {
  ignoredColumnIds: ReadonlySet<string>;
  selection: RowSelectionModel<TData> | null;
  hiddenByPriority: readonly string[];
};

// Written by the table itself: a consumer attribute with one of these names is dropped.
export const INTERNAL_ROW_ATTRIBUTES: readonly string[] = ["data-row-id", "data-clickable", "data-href"];

// Only reserved with `rowSelection`, so a table without it keeps the consumer's own ones.
const SELECTION_ROW_ATTRIBUTES: readonly string[] = [...INTERNAL_ROW_ATTRIBUTES, "data-selected", "aria-selected"];

const buildSelectionAttributes = <TData,>(row: Row<TData>, selection: RowSelectionModel<TData> | null) => {
  if (!selection) return {};
  const isSelected = selection.isSelected(row.id);
  return { "data-selected": isSelected || undefined, "aria-selected": isSelected };
};

export const buildRowAttributes = <TData,>(
  row: Row<TData>,
  config: TableRowConfig<TData>,
  href: string | undefined,
) => ({
  ...pickConsumerAttributes(
    config.getRowAttributes?.(row.original),
    config.selection ? SELECTION_ROW_ATTRIBUTES : INTERNAL_ROW_ATTRIBUTES,
  ),
  "data-row-id": row.id,
  "data-clickable": config.onRowClick || href ? true : undefined,
  "data-href": href,
  ...buildSelectionAttributes(row, config.selection),
});
