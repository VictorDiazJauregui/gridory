import { useEffect, type RefObject } from "react";
import { useThemeVersion } from "./use-theme-version";

export type PreviewEnhancer = (previewRoot: HTMLElement) => void;

/** Fired by the preview when a block drawn on demand changes its height, so the synced scroll can realign. */
export const PREVIEW_CONTENT_CHANGE_EVENT = "markdown-preview-content-change";

export const usePreviewEnhancers = (
  previewRef: RefObject<HTMLElement | null>,
  html: string,
  enhancers: readonly PreviewEnhancer[],
): void => {
  const themeVersion = useThemeVersion(previewRef);
  useEffect(() => {
    const previewRoot = previewRef.current;
    if (!previewRoot) return;
    enhancers.forEach((enhance) => enhance(previewRoot));
  }, [previewRef, html, enhancers, themeVersion]);
};
