import { useLayoutEffect, useState, type RefObject } from "react";
import { countVisibleChips } from "./visible-chip-count";

const CHIP_SELECTOR = "[data-chip]";
const MORE_BADGE_SELECTOR = "[data-more-badge]";

const listRowItems = (container: HTMLElement, selector: string): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(selector));

const readPixels = (cssLength: string): number => Number.parseFloat(cssLength) || 0;

const measureContentWidth = (container: HTMLElement, style: CSSStyleDeclaration): number =>
  container.getBoundingClientRect().width -
  readPixels(style.paddingLeft) -
  readPixels(style.paddingRight) -
  readPixels(style.borderLeftWidth) -
  readPixels(style.borderRightWidth);

// Hidden chips and a hidden "+N" badge have no box. They are shown only for the measure and hidden
// again right away, inside the same task, so the browser never paints them in between.
const measureWidthsShown = (elements: readonly HTMLElement[]): number[] => {
  const hiddenStates = elements.map((element) => element.hidden);
  for (const element of elements) element.hidden = false;
  const widths = elements.map((element) => element.getBoundingClientRect().width);
  elements.forEach((element, index) => {
    element.hidden = hiddenStates[index];
  });
  return widths;
};

const countFittingChips = (container: HTMLElement, chipCount: number): number => {
  const style = getComputedStyle(container);
  const availableWidth = measureContentWidth(container, style);
  // A row that is not laid out (jsdom, or an ancestor with display: none) has no width to share.
  if (availableWidth <= 0) return chipCount;
  return countVisibleChips({
    availableWidth,
    gap: readPixels(style.columnGap),
    chipWidths: measureWidthsShown(listRowItems(container, CHIP_SELECTOR)),
    moreBadgeWidth: Math.max(0, ...measureWidthsShown(listRowItems(container, MORE_BADGE_SELECTOR))),
  });
};

const observeChipRow = (observer: ResizeObserver, container: HTMLElement) => {
  observer.observe(container);
  const rowItems = listRowItems(container, `${CHIP_SELECTOR}, ${MORE_BADGE_SELECTOR}`);
  for (const rowItem of rowItems) observer.observe(rowItem, { box: "border-box" });
};

/**
 * Number of chips that fit in one line of `containerRef`, measured before paint when the chips
 * change and again whenever the row or a chip resizes (width, font size, a web font loading).
 * Keyed by the chips, not by their count: swapping one country for another replaces a chip the
 * observer was not watching, and its new width must be measured too.
 */
export const useVisibleChipCount = (containerRef: RefObject<HTMLElement | null>, chipKeys: readonly string[]): number => {
  const chipCount = chipKeys.length;
  const chipsKey = chipKeys.join("\u0000");
  const [visibleCount, setVisibleCount] = useState(chipCount);
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const updateVisibleCount = () => setVisibleCount(countFittingChips(container, chipCount));
    updateVisibleCount();
    const observer = new ResizeObserver(updateVisibleCount);
    observeChipRow(observer, container);
    return () => observer.disconnect();
  }, [containerRef, chipCount, chipsKey]);
  return Math.min(visibleCount, chipCount);
};
