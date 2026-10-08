import type { EditorController } from "../model/editor-controller";
import { isScrolledToEnd, measurePreviewBlocks } from "../sync-scroll/preview-blocks";
import { mapOffsetToLine } from "../sync-scroll/scroll-mapping";

export interface ScrollSource {
  controller: EditorController;
  previewPanel: HTMLElement | null;
  readsPreview: boolean;
}

const readPreviewTopLine = (panel: HTMLElement): number => {
  const blocks = measurePreviewBlocks(panel, panel.firstElementChild as HTMLElement);
  return mapOffsetToLine(blocks, panel.scrollTop, panel.scrollHeight);
};

export const readScrollingElement = ({ controller, previewPanel, readsPreview }: ScrollSource): HTMLElement | null =>
  readsPreview ? previewPanel : controller.scrollElement;

export const readVisibleTopLine = (source: ScrollSource): number => {
  const element = readScrollingElement(source);
  if (!element) return 1;
  if (element.scrollTop > 0 && isScrolledToEnd(element)) return Number.POSITIVE_INFINITY;
  return source.readsPreview ? readPreviewTopLine(element) : source.controller.readTopLine();
};
