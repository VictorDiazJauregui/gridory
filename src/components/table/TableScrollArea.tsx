import { cn } from "../../lib/cn";
import { TableBody } from "./TableBody";
import { TableHead } from "./TableHead";
import type { TableModelProps } from "./use-table-core";

export const TableScrollArea = <TData,>({ model }: TableModelProps<TData>) => {
  const { settings } = model;
  const { wrapRef } = model.paging;
  return (
    <div
      ref={wrapRef}
      className={cn(
        "gdy-table-wrap gdy-scroll",
        settings.tableMinHeightClassName,
        settings.tableMaxHeightClassName,
        settings.tableWrapClassName,
      )}
    >
      <table className="gdy-table-grid">
        <TableHead model={model} />
        <TableBody model={model} />
      </table>
    </div>
  );
};
