import { cn } from "../../../lib/cn";
import { buildPlaceholderKeys, resolveLoadingRowCount } from "../../shared/loading/loading-state";
import { SkeletonBar } from "../../shared/loading/SkeletonBar";
import { buildCellAttributes, readColumnAlignment } from "../model/cell-attributes";
import type { TableModelProps } from "../model/use-table-core";

const TableSkeletonRows = <TData,>({ model }: TableModelProps<TData>) => {
  const columns = model.table.getVisibleLeafColumns();
  return buildPlaceholderKeys(resolveLoadingRowCount(model.settings.loadingRowCount)).map((key) => (
    <tr key={key} className="gdy-table-skeleton-row" aria-hidden="true">
      {columns.map((column) => (
        <td
          key={column.id}
          className={cn("gdy-table-cell gdy-table-skeleton", model.settings.classNames?.cell)}
          {...buildCellAttributes(column.id, readColumnAlignment(column.columnDef).cells)}
        >
          <SkeletonBar />
        </td>
      ))}
    </tr>
  ));
};

export const TableLoadingRows = <TData,>({ model }: TableModelProps<TData>) => {
  const { renderLoading } = model.settings;
  if (!renderLoading) return <TableSkeletonRows model={model} />;
  return (
    <tr className="gdy-table-loading-row">
      <td className="gdy-table-cell" colSpan={model.table.options.columns.length}>
        {renderLoading()}
      </td>
    </tr>
  );
};
