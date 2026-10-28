const EDGE_MARGIN = 8;

interface HorizontalBounds {
  left: number;
  right: number;
}

const clipsHorizontally = (element: Element) => getComputedStyle(element).overflowX !== "visible";

// A panel inside a scrolling container (the table's rows) is cut at that container's edges.
const findClippingAncestor = (element: HTMLElement) => {
  let current = element.parentElement;
  while (current && !clipsHorizontally(current)) current = current.parentElement;
  return current;
};

const readVisibleBounds = (element: HTMLElement): HorizontalBounds => {
  const screen = { left: 0, right: document.documentElement.clientWidth };
  const clipping = findClippingAncestor(element);
  if (!clipping) return screen;
  const box = clipping.getBoundingClientRect();
  return { left: Math.max(screen.left, box.left), right: Math.min(screen.right, box.right) };
};

/** No room on the right: opens to the left (`data-align="end"`); no room there either: slides right just enough. */
export const fitPanelInView = (panel: HTMLElement) => {
  const anchor = panel.parentElement?.getBoundingClientRect();
  if (!anchor) return;
  const bounds = readVisibleBounds(panel);
  const width = panel.offsetWidth;
  if (anchor.left + width <= bounds.right - EDGE_MARGIN) return;
  panel.setAttribute("data-align", "end");
  const missing = bounds.left + EDGE_MARGIN - (anchor.right - width);
  // The offset depends on the screen at the moment it opens, so it is measured, not a style rule.
  if (missing > 0) panel.style.transform = `translateX(${Math.round(missing)}px)`;
};
