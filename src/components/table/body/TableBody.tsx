import { cn } from "../../../lib/cn";
import { buildRowElements } from "./body-rows";
import { TableLoadingRows } from "./TableLoadingRows";
import { useRowConfig } from "./use-row-config";
import type { TableModelProps } from "../model/use-table-core";

const TableRows = <TData,>({ model }: TableModelProps<TData>) => {
  const { rows } = model.table.getRowModel();
  const config = useRowConfig(model.settings);
  if (rows.length > 0) {
    return rows.flatMap((row, indexInPage) => buildRowElements({ row, indexInPage, model, config }));
  }
  return (
    <tr className="gdy-table-empty-row">
      <td
        className={cn("gdy-table-cell gdy-empty", model.settings.classNames?.empty)}
        colSpan={model.table.options.columns.length}
      >
        {model.settings.emptyMessage}
      </td>
    </tr>
  );
};

export const TableBody = <TData,>({ model }: TableModelProps<TData>) => (
  <tbody className="gdy-table-body">
    {model.settings.loading ? <TableLoadingRows model={model} /> : <TableRows model={model} />}
  </tbody>
);
