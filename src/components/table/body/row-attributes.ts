import type { Row } from "@tanstack/react-table";
import { pickConsumerAttributes } from "../../shared/attributes/consumer-attributes";
import type { ExpandedRowsModel } from "../expansion/use-expanded-rows";
import type { PinnedColumns } from "../columns/pinned-columns";
import type { RowSelectionModel } from "../selection/use-row-selection";
import type { DataTableProps } from "../types";

export type TableRowConfig<TData> = Pick<
  DataTableProps<TData>,
  "onRowClick" | "getRowClassName" | "getRowAttributes" | "getRowHref" | "focusableRows" | "classNames"
> & {
  ignoredColumnIds: ReadonlySet<string>;
  selection: RowSelectionModel<TData> | null;
  expansion: ExpandedRowsModel<TData> | null;
  hiddenByPriority: readonly string[];
  pinnedColumns: PinnedColumns | null;
};

// Written by the table itself: a consumer attribute with one of these names is dropped.
export const INTERNAL_ROW_ATTRIBUTES: readonly string[] = ["data-row-id", "data-clickable", "data-href"];

// Only reserved with `rowSelection` or `renderExpandedRow`, so a table without them keeps the consumer's own ones.
const SELECTION_ROW_ATTRIBUTES: readonly string[] = ["data-selected", "aria-selected"];
const EXPANSION_ROW_ATTRIBUTES: readonly string[] = ["data-expanded"];

const resolveReservedAttributes = <TData,>({ selection, expansion }: TableRowConfig<TData>) => [
  ...INTERNAL_ROW_ATTRIBUTES,
  ...(selection ? SELECTION_ROW_ATTRIBUTES : []),
  ...(expansion ? EXPANSION_ROW_ATTRIBUTES : []),
];

const buildSelectionAttributes = <TData,>(row: Row<TData>, selection: RowSelectionModel<TData> | null) => {
  if (!selection) return {};
  const isSelected = selection.isSelected(row.id);
  return { "data-selected": isSelected || undefined, "aria-selected": isSelected };
};

const buildExpansionAttributes = <TData,>(row: Row<TData>, expansion: ExpandedRowsModel<TData> | null) => {
  if (!expansion) return {};
  return { "data-expanded": expansion.isExpanded(row.id) && expansion.canExpand(row.original) ? true : undefined };
};

export const buildRowAttributes = <TData,>(
  row: Row<TData>,
  config: TableRowConfig<TData>,
  href: string | undefined,
) => ({
  ...pickConsumerAttributes(config.getRowAttributes?.(row.original), resolveReservedAttributes(config)),
  "data-row-id": row.id,
  "data-clickable": config.onRowClick || href ? true : undefined,
  "data-href": href,
  ...buildSelectionAttributes(row, config.selection),
  ...buildExpansionAttributes(row, config.expansion),
});
