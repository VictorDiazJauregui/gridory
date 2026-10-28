import { cn } from "../../../lib/cn";
import { TableBody } from "./TableBody";
import { TableHead } from "../header/TableHead";
import { TableFoot } from "../footer/TableFoot";
import type { TableModelProps } from "../model/use-table-core";
import type { TableSettings } from "../settings";
import { useScrollAreaState } from "./use-scroll-area-state";

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
  const pinnedWidth = model.pinnedColumns?.totalWidth ?? null;
  useScrollAreaState(wrapRef, { tracksWidth: model.expansion !== null, pinnedWidth });
  return (
    <div ref={wrapRef} className={resolveWrapClassName(settings)} data-has-pinned={pinnedWidth === null ? undefined : true}>
      <table className={cn("gdy-table-grid", settings.classNames?.table)}>
        <TableHead model={model} />
        <TableBody model={model} />
        <TableFoot model={model} />
      </table>
    </div>
  );
};
