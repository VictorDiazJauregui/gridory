import { useDeferredValue, useMemo, useRef } from "react";
import { cn } from "../../../lib/cn";
import type { AccessibleName } from "../../shared/accessible-name";
import { renderMarkdownWith } from "../render/render-markdown";
import type { MarkdownRenderOptions } from "../types";
import { usePreviewEnhancers, type PreviewEnhancer } from "./preview-enhancer";
import "../styles.css";

export type PreviewSurfaceProps = Partial<AccessibleName> & {
  value: string;
  renderOptions?: MarkdownRenderOptions;
  className?: string;
  enhancers: readonly PreviewEnhancer[];
  /** Recognizes `$…$` and `$$…$$`, only when something draws them. */
  recognizesMath?: boolean;
};

export const PreviewSurface = ({ value, renderOptions, className, enhancers, recognizesMath = false, ...accessibleName }: PreviewSurfaceProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const deferredValue = useDeferredValue(value);
  const html = useMemo(() => renderMarkdownWith(deferredValue, renderOptions ?? {}, { math: recognizesMath }), [deferredValue, renderOptions, recognizesMath]);
  usePreviewEnhancers(previewRef, html, enhancers);
  const hasName = Boolean(accessibleName["aria-label"] || accessibleName["aria-labelledby"]);
  return (
    <div
      ref={previewRef}
      role={hasName ? "region" : undefined}
      {...accessibleName}
      className={cn("gdy-scope gdy-md-preview", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
