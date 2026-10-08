import type { EditorController } from "../model/editor-controller";
import type { MarkdownHeading } from "../render/read-headings";

const scrollPreviewToHeading = (panel: HTMLElement, id: string): void => {
  const heading = panel.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`);
  if (!heading) return;
  panel.scrollTop += heading.getBoundingClientRect().top - panel.getBoundingClientRect().top;
};

export const revealHeading = (controller: EditorController | null, previewPanel: HTMLElement | null, heading: MarkdownHeading): void => {
  controller?.revealLine(heading.line);
  if (previewPanel) scrollPreviewToHeading(previewPanel, heading.id);
};
