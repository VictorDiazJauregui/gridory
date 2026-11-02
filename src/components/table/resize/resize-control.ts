import type { TableModel } from "../model/use-table-core";
import { clampWidth, type WidthLimits } from "../columns/column-widths";
import type { ColumnWidthsModel, ResizeDraft } from "./use-column-widths";

export interface ResizeSession {
  startWidth: number;
  /** `-1` on a right-pinned column, whose handle is on its left edge: it grows leftward. */
  direction: 1 | -1;
  limits: WidthLimits;
}

export interface ResizeControl {
  begin: () => ResizeSession;
  preview: (session: ResizeSession, width: number, source: ResizeDraft["source"]) => number;
  finish: (session: ResizeSession, width: number) => void;
  reset: () => void;
}

interface ResizeTarget<TData> {
  columnId: string;
  model: TableModel<TData>;
  widths: ColumnWidthsModel;
}

// Pinning lets go past half of the container (data-pinning-suspended); once let go, it is an ordinary column.
const findStickyPlacement = <TData,>({ columnId, model }: ResizeTarget<TData>) => {
  const wrap = model.paging.wrapRef.current;
  if (!wrap || wrap.hasAttribute("data-pinning-suspended")) return undefined;
  return model.pinnedColumns?.placements.get(columnId);
};

// A sticky column stops growing where the pinned block reaches half of the container: resizing never unpins.
const resolveResizeLimits = <TData,>(target: ResizeTarget<TData>, startWidth: number): WidthLimits => {
  const limits = target.widths.readLimits(target.columnId);
  const placement = findStickyPlacement(target);
  const { pinnedColumns, paging } = target.model;
  if (!placement || !pinnedColumns || !paging.wrapRef.current) return limits;
  const room = Math.floor(paging.wrapRef.current.clientWidth / 2 - (pinnedColumns.totalWidth - placement.width));
  return { min: limits.min, max: Math.max(limits.min, Math.min(limits.max, Math.max(room, startWidth))) };
};

const resolveResizeDirection = <TData,>(target: ResizeTarget<TData>): ResizeSession["direction"] =>
  findStickyPlacement(target)?.side === "right" ? -1 : 1;

export const buildResizeControl = <TData,>(target: ResizeTarget<TData>): ResizeControl => {
  const { columnId, widths } = target;
  return {
    begin: () => {
      widths.freeze();
      const startWidth = widths.readWidth(columnId);
      return { startWidth, limits: resolveResizeLimits(target, startWidth), direction: resolveResizeDirection(target) };
    },
    preview: (session, width, source) => {
      const clamped = clampWidth(width, session.limits);
      widths.preview({ columnId, width: clamped, source });
      return clamped;
    },
    finish: (session, width) => {
      if (width === session.startWidth) widths.cancel();
      else widths.commit(columnId, width);
    },
    reset: () => widths.reset(columnId),
  };
};
