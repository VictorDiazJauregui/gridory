import { cn } from "../../../lib/cn";
import { TableBody } from "./TableBody";
import { TableHead } from "../header/TableHead";
import type { TableModelProps } from "../model/use-table-core";
import type { TableSettings } from "../settings";

// The legacy *ClassName props first, so `classNames.wrap` lands last like every other part.
const resolveWrapClassName = <TData,>(settings: TableSettings<TData>) =>
  cn(
    "gdy-table-wrap gdy-scroll",
    settings.tableMinHeightClassName,
    settings.tableMaxHeightClassName,
    settings.tableWrapClassName,
    settings.classNames?.wrap,
  );

export const TableScrollArea = <TData,>({ model }: TableModelProps<TData>) => {
  const { settings } = model;
  const { wrapRef } = model.paging;
  return (
    <div ref={wrapRef} className={resolveWrapClassName(settings)}>
      <table className={cn("gdy-table-grid", settings.classNames?.table)}>
        <TableHead model={model} />
        <TableBody model={model} />
      </table>
    </div>
  );
};
