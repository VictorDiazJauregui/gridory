import { flexRender, type Row } from "@tanstack/react-table";
import { cn } from "../../../lib/cn";
import { buildCellAttributes, readColumnAlignment } from "../model/cell-attributes";
import { buildRowAttributes, type TableRowConfig } from "./row-attributes";
import { buildRowHandlers, resolveSafeRowHref } from "./row-navigation";

interface TableDataRowProps<TData> {
  row: Row<TData>;
  config: TableRowConfig<TData>;
}

export const TableDataRow = <TData,>({ row, config }: TableDataRowProps<TData>) => {
  const href = resolveSafeRowHref(config.getRowHref?.(row.original));
  return (
    <tr
      className={cn("gdy-table-row", config.getRowClassName?.(row.original))}
      {...buildRowAttributes(row, config, href)}
      {...buildRowHandlers({ row: row.original, href, config })}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className="gdy-table-cell"
          {...buildCellAttributes(cell.column.id, readColumnAlignment(cell.column.columnDef).cells)}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};
