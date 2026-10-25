import { useLayoutEffect, useState, type RefObject } from "react";
import { countFittingGroups, readMeasuredWidths } from "./fitting-groups";

const observeWidth = (element: HTMLElement, onResize: () => void): (() => void) => {
  onResize();
  const observer = new ResizeObserver(onResize);
  observer.observe(element);
  return () => observer.disconnect();
};

export const useFittingGroups = (
  toolbarRef: RefObject<HTMLElement | null>,
  measureRef: RefObject<HTMLElement | null>,
  groupCount: number,
): number => {
  const [visibleCount, setVisibleCount] = useState(groupCount);
  useLayoutEffect(() => {
    const toolbar = toolbarRef.current;
    const measureRow = measureRef.current;
    if (!toolbar || !measureRow || typeof ResizeObserver === "undefined") return undefined;
    return observeWidth(toolbar, () => {
      const { groups, overflow } = readMeasuredWidths(measureRow);
      setVisibleCount(countFittingGroups(groups, toolbar.clientWidth, overflow));
    });
  }, [toolbarRef, measureRef, groupCount]);
  return Math.min(visibleCount, groupCount);
};
