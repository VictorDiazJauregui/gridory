/** Widths in px of one row of chips, as laid out by the browser. */
export interface ChipRowMeasure {
  chipWidths: readonly number[];
  availableWidth: number;
  moreBadgeWidth: number;
  gap: number;
}

const measureRowWidth = (widths: readonly number[], gap: number): number =>
  widths.reduce((rowWidth, width, index) => rowWidth + width + (index > 0 ? gap : 0), 0);

const countChipsWithin = (chipWidths: readonly number[], gap: number, rowLimit: number): number => {
  let rowWidth = 0;
  for (const [index, width] of chipWidths.entries()) {
    rowWidth += width + (index > 0 ? gap : 0);
    if (rowWidth > rowLimit) return index;
  }
  return chipWidths.length;
};

/** How many chips fit, in order. When some are left out, room is kept for the "+N" badge and its gap. */
export const countVisibleChips = (measure: ChipRowMeasure): number => {
  const { chipWidths, availableWidth, moreBadgeWidth, gap } = measure;
  if (measureRowWidth(chipWidths, gap) <= availableWidth) return chipWidths.length;
  return countChipsWithin(chipWidths, gap, availableWidth - moreBadgeWidth - gap);
};
