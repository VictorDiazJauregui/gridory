import { useLayoutEffect, type RefObject } from "react";

const VISIBLE_WIDTH = "--gdy-table-visible-width";
const SCROLL_ATTRIBUTES = ["data-scrolled-start", "data-scrolled-end", "data-pinning-suspended"];
// Sub-pixel widths leave scrollLeft a fraction short of the end.
const END_TOLERANCE_IN_PX = 1;

/** What the rows container reports about itself; `pinnedWidth` is `null` without pinned columns. */
export interface ScrollAreaTracking {
  tracksWidth: boolean;
  pinnedWidth: number | null;
}

// Pinned columns that take more than half of what is on screen would leave no room to scroll: they let go.
const writeScrollState = (wrap: HTMLDivElement, pinnedWidth: number | null) => {
  wrap.style.setProperty(VISIBLE_WIDTH, `${wrap.clientWidth}px`);
  if (pinnedWidth === null) return;
  const lastScrollLeft = wrap.scrollWidth - wrap.clientWidth - END_TOLERANCE_IN_PX;
  wrap.toggleAttribute("data-scrolled-start", wrap.scrollLeft > 0);
  wrap.toggleAttribute("data-scrolled-end", wrap.scrollLeft < lastScrollLeft);
  wrap.toggleAttribute("data-pinning-suspended", pinnedWidth > wrap.clientWidth / 2);
};

const clearScrollState = (wrap: HTMLDivElement) => {
  wrap.style.removeProperty(VISIBLE_WIDTH);
  SCROLL_ATTRIBUTES.forEach((name) => wrap.removeAttribute(name));
};

// One write per frame, from a passive scroll listener and from the size of the container and of its table.
const observeScrollArea = (wrap: HTMLDivElement, pinnedWidth: number | null) => {
  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => writeScrollState(wrap, pinnedWidth));
  };
  const observer = new ResizeObserver(schedule);
  [wrap, wrap.firstElementChild].forEach((element) => element && observer.observe(element));
  wrap.addEventListener("scroll", schedule, { passive: true });
  writeScrollState(wrap, pinnedWidth);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    wrap.removeEventListener("scroll", schedule);
    clearScrollState(wrap);
  };
};

/**
 * Writes on the rows container the width it shows (`--gdy-table-visible-width`) and, with pinned columns, whether
 * there is content under them (`data-scrolled-start`/`-end`), without a render per scroll. Off when nothing reads it.
 */
export const useScrollAreaState = (wrapRef: RefObject<HTMLDivElement | null>, tracking: ScrollAreaTracking) => {
  const { tracksWidth, pinnedWidth } = tracking;
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || (!tracksWidth && pinnedWidth === null)) return;
    return observeScrollArea(wrap, pinnedWidth);
  }, [wrapRef, tracksWidth, pinnedWidth]);
};
