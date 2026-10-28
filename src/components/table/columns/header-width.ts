const readHorizontalPadding = (element: Element) => {
  const style = getComputedStyle(element);
  return (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
};

const isInFlow = (element: Element) => getComputedStyle(element).position !== "absolute";

// The label cuts its text with an ellipsis: its scrollWidth is the whole title, the rest is laid out as is.
const readNaturalWidth = (element: Element): number => {
  if (element.classList.contains("gdy-table-head-label")) return element.scrollWidth;
  const children = [...element.children].filter(isInFlow);
  if (children.length === 0) return element.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
  const childrenWidth = children.reduce((sum, child) => sum + readNaturalWidth(child), 0);
  return childrenWidth + gap * (children.length - 1) + readHorizontalPadding(element);
};

/** Width a header cell needs to show its whole title and icons, or `undefined` while it is not rendered. */
export const measureHeaderWidth = (headerCell: Element | null) => {
  if (!headerCell || headerCell.getClientRects().length === 0) return undefined;
  const content = headerCell.querySelector(".gdy-table-head-inner") ?? headerCell;
  return Math.ceil(readNaturalWidth(content) + readHorizontalPadding(headerCell));
};
