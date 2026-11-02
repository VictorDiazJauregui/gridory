import type { ColumnDefinition } from "../types";

export const DEFAULT_MIN_COLUMN_WIDTH = 64;
// A separator needs an `aria-valuemax`; without `maxWidth` this ceiling is that value and the real limit.
export const MAX_COLUMN_WIDTH = 4000;

export interface WidthLimits {
  min: number;
  max: number;
}

export type ColumnWidthMap = Readonly<Record<string, number>>;

export interface WidthSources {
  userWidths: ColumnWidthMap;
  frozenWidths: ColumnWidthMap;
  fallbackWidth: (columnId: string) => number;
}

export const resolveWidthLimits = <TData,>(definition?: ColumnDefinition<TData>): WidthLimits => {
  const min = definition?.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH;
  return { min, max: Math.max(min, definition?.maxWidth ?? MAX_COLUMN_WIDTH) };
};

export const clampWidth = (width: number, limits: WidthLimits) =>
  Math.round(Math.min(limits.max, Math.max(limits.min, width)));

/** Same object when nothing changes, so the controlled state does not report a change. */
export const withColumnWidth = (widths: ColumnWidthMap, columnId: string, width: number): ColumnWidthMap =>
  widths[columnId] === width ? widths : { ...widths, [columnId]: width };

export const withoutColumnWidth = (widths: ColumnWidthMap, columnId: string): ColumnWidthMap => {
  if (!(columnId in widths)) return widths;
  const rest = { ...widths };
  delete rest[columnId];
  return rest;
};

export const resolveLayoutWidth = (columnId: string, sources: WidthSources) =>
  sources.userWidths[columnId] ?? sources.frozenWidths[columnId] ?? sources.fallbackWidth(columnId);

export const sumWidths = (widths: ReadonlyMap<string, number>, skippedIds: readonly string[]) =>
  [...widths].reduce((sum, [columnId, width]) => (skippedIds.includes(columnId) ? sum : sum + width), 0);
