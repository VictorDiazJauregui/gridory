import { flexRender, type Row } from "@tanstack/react-table";
import { cn } from "../../../lib/cn";
import { buildCellAttributes } from "../model/cell-attributes";
import { buildRowAttributes, type TableRowConfig } from "./row-attributes";

interface TableDataRowProps<TData> {
  row: Row<TData>;
  config: TableRowConfig<TData>;
}

export const TableDataRow = <TData,>({ row, config }: TableDataRowProps<TData>) => {
  const { onRowClick, getRowClassName } = config;
  return (
    <tr
      className={cn("gdy-table-row", getRowClassName?.(row.original))}
      {...buildRowAttributes(row, config)}
      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="gdy-table-cell" {...buildCellAttributes(cell.column.id)}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};
