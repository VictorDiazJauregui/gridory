import type { ColumnWidthMap } from "../columns/column-widths";

// Fractions are kept: the frozen widths add up to the container exactly, so freezing never adds a scrollbar.
// A hidden column (priority) measures 0 and is left to its fallback width.
export const measureHeaderCells = (wrap: HTMLDivElement): ColumnWidthMap => {
  const cells = wrap.querySelectorAll<HTMLTableCellElement>(":scope > table > thead > tr > th[data-column-id]");
  const entries = [...cells]
    .map((cell): [string, number] => [cell.dataset.columnId ?? "", cell.getBoundingClientRect().width])
    .filter(([, width]) => width > 0);
  return Object.fromEntries(entries);
};

export const isSameWidthMap = (first: ColumnWidthMap | null, second: ColumnWidthMap) => {
  if (!first) return false;
  const firstIds = Object.keys(first);
  return firstIds.length === Object.keys(second).length && firstIds.every((id) => first[id] === second[id]);
};
