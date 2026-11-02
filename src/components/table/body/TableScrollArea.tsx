import type { CSSProperties } from "react";
import { cn } from "../../../lib/cn";
import { sumWidths } from "../columns/column-widths";
import { TableBody } from "./TableBody";
import { TableHead } from "../header/TableHead";
import { TableFoot } from "../footer/TableFoot";
import type { TableModel, TableModelProps } from "../model/use-table-core";
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

// Resized, the grid is as wide as its columns: one edge moves and nothing else stretches to fill the container.
const buildGridLayout = <TData,>({ columnWidths, hiddenByPriority }: TableModel<TData>) => {
  const layoutWidths = columnWidths?.layoutWidths;
  if (!layoutWidths) return {};
  const style = { "--gdy-table-grid-width": `${sumWidths(layoutWidths, hiddenByPriority)}px` } as CSSProperties;
  return { "data-resized": true, style };
};

export const TableScrollArea = <TData,>({ model }: TableModelProps<TData>) => {
  const { settings } = model;
  const { wrapRef } = model.paging;
  const pinnedWidth = model.pinnedColumns?.totalWidth ?? null;
  useScrollAreaState(wrapRef, { tracksWidth: model.expansion !== null, pinnedWidth });
  return (
    <div
      ref={wrapRef}
      className={resolveWrapClassName(settings)}
      data-has-pinned={pinnedWidth === null ? undefined : true}
      data-resizing={model.columnWidths?.isPointerResizing ? true : undefined}
    >
      <table className={cn("gdy-table-grid", settings.classNames?.table)} {...buildGridLayout(model)}>
        <TableHead model={model} />
        <TableBody model={model} />
        <TableFoot model={model} />
      </table>
    </div>
  );
};
