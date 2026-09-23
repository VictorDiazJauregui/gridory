import { useLayoutEffect, useRef } from "react";
import type { PageWindow } from "./use-table-pagination";
import type { ViewSnapshot } from "./use-view-snapshot";

export const useScrollResetOnPageChange = (
  { pageIndex, pageSize }: PageWindow,
  scrollResetOnPageChange: boolean,
  viewSnapshot: ViewSnapshot,
) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!scrollResetOnPageChange) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.scrollTop = 0;
  }, [scrollResetOnPageChange, pageIndex, pageSize, viewSnapshot]);
  return wrapRef;
};
