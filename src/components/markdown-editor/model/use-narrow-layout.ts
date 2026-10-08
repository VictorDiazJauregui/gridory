import { useEffect, useMemo, useState } from "react";
import type { MarkdownEditorView } from "../types";

/** Below this width the split view shows one panel at a time, switched like tabs. */
export const NARROW_LAYOUT_MAX_WIDTH = 768;

export type SplitTab = Exclude<MarkdownEditorView, "split">;

export interface NarrowLayoutState {
  narrowLayout: boolean;
  reportNarrowLayout: (narrow: boolean) => void;
  splitTab: SplitTab;
  changeSplitTab: (tab: SplitTab) => void;
}

export const useNarrowLayoutState = (): NarrowLayoutState => {
  const [narrowLayout, reportNarrowLayout] = useState(false);
  const [splitTab, changeSplitTab] = useState<SplitTab>("source");
  return useMemo(() => ({ narrowLayout, reportNarrowLayout, splitTab, changeSplitTab }), [narrowLayout, splitTab]);
};

export const readDisplayedView = ({ view, narrowLayout, splitTab }: Pick<NarrowLayoutState, "narrowLayout" | "splitTab"> & { view: MarkdownEditorView }): MarkdownEditorView =>
  view === "split" && narrowLayout ? splitTab : view;

export const useReportNarrowLayout = (element: HTMLElement | null, report: (narrow: boolean) => void): void => {
  useEffect(() => {
    if (!element || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(([entry]) => report(entry.contentRect.width < NARROW_LAYOUT_MAX_WIDTH));
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, report]);
};
