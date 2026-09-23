import { buildRowElements } from "./body-rows";
import type { TableModelProps } from "./use-table-core";

export const TableBody = <TData,>({ model }: TableModelProps<TData>) => {
  const { rows } = model.table.getRowModel();
  const colSpan = model.table.options.columns.length;
  return (
    <tbody className="gdy-table-body">
      {rows.length === 0 ? (
        <tr className="gdy-table-empty-row">
          <td className="gdy-table-cell gdy-empty" colSpan={colSpan}>
            {model.settings.emptyMessage}
          </td>
        </tr>
      ) : (
        rows.flatMap((row, indexInPage) =>
          buildRowElements({ row, indexInPage, model }),
        )
      )}
    </tbody>
  );
};
