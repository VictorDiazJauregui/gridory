import { cn } from "../../../lib/cn";
import { SkeletonBar } from "../../shared/loading/SkeletonBar";
import type { ColumnFooterContext } from "../../shared/data-model";
import { buildCellAttributes } from "../model/cell-attributes";
import type { TableModelProps } from "../model/use-table-core";
import { buildFooterContext, resolveFooterColumns, type FooterColumn } from "./footer-columns";

interface FootCellProps<TData> {
  column: FooterColumn<TData>;
  context: ColumnFooterContext<TData>;
  loading: boolean;
  className?: string;
  hiddenByPriority: readonly string[];
}

const renderFootContent = <TData,>({ column, context, loading }: FootCellProps<TData>) => {
  if (!column.footer) return null;
  return loading ? <SkeletonBar /> : column.footer(context);
};

const TableFootCell = <TData,>(props: FootCellProps<TData>) => (
  <td
    className={cn("gdy-table-foot-cell", props.className)}
    {...buildCellAttributes(props.column.id, props.column.alignment.cells, props.hiddenByPriority)}
  >
    {renderFootContent(props)}
  </td>
);

const TableFootRow = <TData,>({ model, columns }: TableModelProps<TData> & { columns: FooterColumn<TData>[] }) => {
  const context = buildFooterContext(model);
  const { loading, classNames } = model.settings;
  return (
    <tr className="gdy-table-foot-row">
      {columns.map((column) => (
        <TableFootCell
          key={column.id}
          column={column}
          context={context}
          loading={Boolean(loading)}
          className={classNames?.footCell}
          hiddenByPriority={model.hiddenByPriority}
        />
      ))}
    </tr>
  );
};

export const TableFoot = <TData,>({ model }: TableModelProps<TData>) => {
  const columns = resolveFooterColumns(model);
  if (!columns.some((column) => column.footer)) return null;
  return (
    <tfoot className={cn("gdy-table-foot", model.settings.classNames?.foot)}>
      <TableFootRow model={model} columns={columns} />
    </tfoot>
  );
};
