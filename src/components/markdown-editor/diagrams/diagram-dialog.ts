import type { MarkdownDiagramTexts } from "../types";

const createCloseButton = (dialog: HTMLDialogElement, label: string): HTMLButtonElement => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "gdy-md-diagram-dialog-close";
  button.textContent = label;
  button.addEventListener("click", () => dialog.close());
  return button;
};

export const openDiagramDialog = (canvas: HTMLElement, texts: MarkdownDiagramTexts): void => {
  const dialog = document.createElement("dialog");
  dialog.className = "gdy-scope gdy-md-diagram-dialog";
  dialog.setAttribute("aria-label", texts.label);
  const content = canvas.cloneNode(true) as HTMLElement;
  content.className = "gdy-md-diagram-dialog-canvas";
  dialog.append(createCloseButton(dialog, texts.close), content);
  dialog.addEventListener("close", () => dialog.remove());
  dialog.addEventListener("click", (event) => event.target === dialog && dialog.close());
  // Beside the preview, not inside it: its typography rules would reach the dialog, while the app's theme scope still does.
  const preview = canvas.closest(".gdy-md-preview");
  (preview?.parentElement ?? document.body).append(dialog);
  dialog.showModal();
};
