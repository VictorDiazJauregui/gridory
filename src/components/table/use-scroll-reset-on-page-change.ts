import { useLayoutEffect, useRef } from "react";
import type { TableSettings } from "./settings";
import type { PageWindow } from "./use-table-pagination";
import type { ViewSnapshot } from "./use-view-snapshot";

export const useScrollResetOnPageChange = <TData>(
  { pageIndex, pageSize }: PageWindow,
  { scrollResetOnPageChange }: TableSettings<TData>,
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
