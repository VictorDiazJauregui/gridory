import type { ColumnPin } from "../types";

export class PinnedColumnWidthError extends Error {
  constructor(columnId: string) {
    super(`Column "${columnId}" has pin but no width: a pinned column's offset is the sum of the widths before it.`);
    this.name = "PinnedColumnWidthError";
  }
}

/** A column on screen, in screen order, as the pin calculation sees it. */
export interface PinCandidate {
  id: string;
  width: number;
  pin?: ColumnPin;
}

/** Where a pinned column sticks: its side, its distance to that edge and whether it closes the pinned block. */
export interface PinPlacement {
  side: ColumnPin;
  offset: number;
  width: number;
  isEdge: boolean;
}

export interface PinnedColumns {
  placements: ReadonlyMap<string, PinPlacement>;
  /** Width of every pinned column, both sides. */
  totalWidth: number;
}

interface PinnableColumn {
  id: string;
  width?: number;
  pin?: ColumnPin;
}

// `columns` go from the edge inward: each offset adds the widths of the pinned columns before it.
const placeSide = (columns: PinCandidate[], side: ColumnPin) => {
  let offset = 0;
  return columns.map((column, index): [string, PinPlacement] => {
    const placement = { side, offset, width: column.width, isEdge: index === columns.length - 1 };
    offset += column.width;
    return [column.id, placement];
  });
};

/** `null` when no column on screen is pinned, so the markup stays as without `pin`. */
export const resolvePinnedColumns = (columns: PinCandidate[]): PinnedColumns | null => {
  const left = columns.filter((column) => column.pin === "left");
  const right = columns.filter((column) => column.pin === "right").reverse();
  if (left.length === 0 && right.length === 0) return null;
  return {
    placements: new Map([...placeSide(left, "left"), ...placeSide(right, "right")]),
    totalWidth: [...left, ...right].reduce((sum, column) => sum + column.width, 0),
  };
};

const assertPinnedWidth = (column: PinnableColumn) => {
  if (column.pin && column.width === undefined) throw new PinnedColumnWidthError(column.id);
};

/** Moves the pinned columns to their edge, each side in declaration order; the rest keeps its order. */
export const orderByPin = <TColumn extends PinnableColumn>(columns: TColumn[]): TColumn[] => {
  columns.forEach(assertPinnedWidth);
  if (!columns.some((column) => column.pin)) return columns;
  return [
    ...columns.filter((column) => column.pin === "left"),
    ...columns.filter((column) => !column.pin),
    ...columns.filter((column) => column.pin === "right"),
  ];
};
