import type { Row } from "@tanstack/react-table";
import { pickConsumerAttributes } from "../../shared/attributes/consumer-attributes";
import type { DataTableProps } from "../types";

export type TableRowConfig<TData> = Pick<
  DataTableProps<TData>,
  "onRowClick" | "getRowClassName" | "getRowAttributes" | "getRowHref" | "focusableRows" | "classNames"
> & {
  /** Ids of the columns with `ignoreRowClick`. */
  ignoredColumnIds: ReadonlySet<string>;
};

// Written by the table itself: a consumer attribute with one of these names is dropped.
export const INTERNAL_ROW_ATTRIBUTES: readonly string[] = ["data-row-id", "data-clickable", "data-href"];

export const buildRowAttributes = <TData,>(
  row: Row<TData>,
  config: TableRowConfig<TData>,
  href: string | undefined,
) => ({
  ...pickConsumerAttributes(config.getRowAttributes?.(row.original), INTERNAL_ROW_ATTRIBUTES),
  "data-row-id": row.id,
  "data-clickable": config.onRowClick || href ? true : undefined,
  "data-href": href,
});
