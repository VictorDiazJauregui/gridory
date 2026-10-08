import type { SourceBlockPosition } from "./scroll-mapping";

export const measurePreviewBlocks = (scrollContainer: HTMLElement, previewRoot: HTMLElement): SourceBlockPosition[] => {
  const containerTop = scrollContainer.getBoundingClientRect().top - scrollContainer.scrollTop;
  return [...previewRoot.querySelectorAll<HTMLElement>(":scope > [data-source-line]")].map((block) => ({
    line: Number(block.dataset.sourceLine),
    top: block.getBoundingClientRect().top - containerTop,
  }));
};

export const isScrolledToEnd = (element: HTMLElement): boolean =>
  element.scrollTop + element.clientHeight >= element.scrollHeight - 1;

export const scrollToEnd = (element: HTMLElement): void => {
  element.scrollTop = element.scrollHeight - element.clientHeight;
};
