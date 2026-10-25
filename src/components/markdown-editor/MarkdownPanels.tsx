import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { MARKDOWN_EDITOR_DEFAULTS } from "./constants";
import { useMarkdownEditorContext } from "./model/markdown-editor-context";
import { readDisplayedView, useReportNarrowLayout } from "./model/use-narrow-layout";
import { MarkdownPreview } from "./preview/MarkdownPreview";
import { MarkdownSource } from "./source/MarkdownSource";
import { useSyncedScroll } from "./sync-scroll/use-synced-scroll";

export interface MarkdownPanelsProps {
  /** Scrolling one panel of the split view scrolls the other to the same block. On by default. */
  syncScroll?: boolean;
  /** Rendered above the source panel only, such as a toolbar that belongs to the writing area. */
  sourceHeader?: ReactNode;
  className?: string;
}

export const MarkdownPanels = ({ syncScroll = MARKDOWN_EDITOR_DEFAULTS.syncScroll, sourceHeader, className }: MarkdownPanelsProps) => {
  const { controller, previewPanel, attachPreviewPanel, reportNarrowLayout, ...layout } = useMarkdownEditorContext("MarkdownPanels");
  const [panels, attachPanels] = useState<HTMLElement | null>(null);
  const view = readDisplayedView(layout);
  useReportNarrowLayout(panels, reportNarrowLayout);
  useSyncedScroll({ controller, previewPanel, enabled: syncScroll && view === "split" });
  return (
    <div ref={attachPanels} className={cn("gdy-md-panels", className)} data-view={view}>
      <div className="gdy-md-source-panel" hidden={view === "preview"}>
        {sourceHeader}
        <MarkdownSource />
      </div>
      <div ref={attachPreviewPanel} className="gdy-md-preview-panel" hidden={view === "source"}>
        <MarkdownPreview />
      </div>
    </div>
  );
};
