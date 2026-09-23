import { cn } from "../../lib/cn";
import { normalizeToArray } from "../shared/row-pipeline";
import type { SelectTheme } from "../shared/select-theme";
import { InlineSelectCell } from "./InlineSelectCell";
import type { ColumnDefinition } from "./types";

interface TableCellContentProps<TData> {
  column: ColumnDefinition<TData>;
  row: TData;
  selectTheme?: SelectTheme;
}

const canInlineEdit = <TData,>(column: ColumnDefinition<TData>) =>
  Boolean(column.inlineEditOptions?.length && column.onInlineEdit);

const renderCellValue = <TData,>(
  column: ColumnDefinition<TData>,
  row: TData,
) => {
  if (column.cell) return column.cell(row);
  return String(normalizeToArray(column.accessor(row)).join(", ") || "—");
};

export const TableCellContent = <TData,>(
  props: TableCellContentProps<TData>,
) => {
  const { column, row } = props;
  const value = normalizeToArray(column.accessor(row))[0] ?? "";
  const highlight = column.valueHighlights?.[value];
  return (
    <div className={cn("gdy-table-cell-content", highlight?.className)}>
      {canInlineEdit(column) ? (
        <InlineSelectCell {...props} value={value} highlight={highlight} />
      ) : (
        renderCellValue(column, row)
      )}
    </div>
  );
};
