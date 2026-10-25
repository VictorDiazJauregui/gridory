import type { Row } from "@tanstack/react-table";
import type { DataTableProps, RowAttributes } from "../types";

export type TableRowConfig<TData> = Pick<
  DataTableProps<TData>,
  "onRowClick" | "getRowClassName" | "getRowAttributes"
>;

type RowAttributeValue = RowAttributes[keyof RowAttributes];

// Written by the table itself: a consumer attribute with one of these names is dropped.
export const INTERNAL_ROW_ATTRIBUTES: readonly string[] = ["data-row-id", "data-clickable"];

const CONSUMER_ATTRIBUTE_PREFIXES = ["data-", "aria-"];

const isAllowedRowAttribute = (name: string) =>
  CONSUMER_ATTRIBUTE_PREFIXES.some((prefix) => name.startsWith(prefix)) &&
  !INTERNAL_ROW_ATTRIBUTES.includes(name);

// In ARIA `false` is a state ("aria-selected=false"); on a data hook it means "absent".
const isRenderedValue = (name: string, value: RowAttributeValue) => {
  if (value === undefined) return false;
  return value !== false || name.startsWith("aria-");
};

export const pickConsumerRowAttributes = (attributes: RowAttributes | undefined) =>
  Object.fromEntries(
    Object.entries(attributes ?? {})
      .filter(([name, value]) => isAllowedRowAttribute(name) && isRenderedValue(name, value))
      .map(([name, value]) => [name, String(value)]),
  );

export const buildRowAttributes = <TData,>(row: Row<TData>, config: TableRowConfig<TData>) => ({
  ...pickConsumerRowAttributes(config.getRowAttributes?.(row.original)),
  "data-row-id": row.id,
  "data-clickable": config.onRowClick ? true : undefined,
});
