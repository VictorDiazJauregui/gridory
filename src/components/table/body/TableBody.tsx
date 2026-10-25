import { cn } from "../../../lib/cn";
import { buildRowElements } from "./body-rows";
import { useRowConfig } from "./use-row-config";
import type { TableModelProps } from "../model/use-table-core";

export const TableBody = <TData,>({ model }: TableModelProps<TData>) => {
  const { rows } = model.table.getRowModel();
  const colSpan = model.table.options.columns.length;
  const config = useRowConfig(model.settings);
  return (
    <tbody className="gdy-table-body">
      {rows.length === 0 ? (
        <tr className="gdy-table-empty-row">
          <td className={cn("gdy-table-cell gdy-empty", model.settings.classNames?.empty)} colSpan={colSpan}>
            {model.settings.emptyMessage}
          </td>
        </tr>
      ) : (
        rows.flatMap((row, indexInPage) =>
          buildRowElements({ row, indexInPage, model, config }),
        )
      )}
    </tbody>
  );
};
