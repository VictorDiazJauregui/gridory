import type { MarkdownDiagramTexts } from "../types";
import type { DiagramOutcome } from "./diagram-cache";
import { openDiagramDialog } from "./diagram-dialog";

export const DIAGRAM_BLOCK_SELECTOR = 'pre[data-language="mermaid"]:not(.gdy-md-diagram-source)';

const createElement = (tag: string, className: string, text?: string): HTMLElement => {
  const element = document.createElement(tag);
  element.className = className;
  if (text) element.textContent = text;
  return element;
};

const createExpandButton = (canvas: HTMLElement, texts: MarkdownDiagramTexts): HTMLButtonElement => {
  const button = createElement("button", "gdy-md-diagram-expand", texts.expand) as HTMLButtonElement;
  button.type = "button";
  button.addEventListener("click", () => openDiagramDialog(canvas, texts));
  return button;
};

export const wrapDiagramSource = (source: HTMLElement, texts: MarkdownDiagramTexts): HTMLElement => {
  const figure = createElement("figure", "gdy-md-diagram");
  figure.dataset.sourceLine = source.dataset.sourceLine ?? "";
  figure.setAttribute("data-diagram-state", "loading");
  figure.setAttribute("aria-label", texts.label);
  figure.setAttribute("aria-busy", "true");
  source.removeAttribute("data-source-line");
  source.classList.add("gdy-md-diagram-source");
  source.replaceWith(figure);
  figure.append(createElement("figcaption", "gdy-md-diagram-status", texts.rendering), source);
  return figure;
};

const showSvg = (svg: string, texts: MarkdownDiagramTexts): HTMLElement[] => {
  const canvas = createElement("div", "gdy-md-diagram-canvas");
  canvas.innerHTML = svg;
  return [canvas, createExpandButton(canvas, texts)];
};

const showError = (error: string, texts: MarkdownDiagramTexts): HTMLElement[] => {
  const box = createElement("div", "gdy-md-diagram-error");
  box.setAttribute("role", "alert");
  box.append(createElement("strong", "gdy-md-diagram-error-title", texts.error), createElement("p", "gdy-md-diagram-error-message", error));
  return [box];
};

export const showDiagramOutcome = (figure: HTMLElement, outcome: DiagramOutcome, texts: MarkdownDiagramTexts): void => {
  const source = figure.querySelector<HTMLElement>(".gdy-md-diagram-source");
  const parts = "svg" in outcome ? showSvg(outcome.svg, texts) : showError(outcome.error, texts);
  figure.replaceChildren(...parts, ...(source ? [source] : []));
  figure.setAttribute("data-diagram-state", "svg" in outcome ? "ready" : "error");
  figure.removeAttribute("aria-busy");
};
