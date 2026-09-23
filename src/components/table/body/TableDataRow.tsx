import { flexRender, type Row } from "@tanstack/react-table";
import type { DataTableProps } from "../types";

interface TableDataRowProps<TData> {
  row: Row<TData>;
  onRowClick: DataTableProps<TData>["onRowClick"];
}

export const TableDataRow = <TData,>({
  row,
  onRowClick,
}: TableDataRowProps<TData>) => (
  <tr
    className="gdy-table-row"
    data-clickable={onRowClick ? true : undefined}
    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
  >
    {row.getVisibleCells().map((cell) => (
      <td key={cell.id} className="gdy-table-cell">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    ))}
  </tr>
);
