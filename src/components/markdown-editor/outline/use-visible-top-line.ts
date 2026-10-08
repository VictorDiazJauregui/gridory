import { useEffect, useState } from "react";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import { readDisplayedView } from "../model/use-narrow-layout";
import { readScrollingElement, readVisibleTopLine, type ScrollSource } from "./visible-top-line";

const followScroll = (source: ScrollSource, report: (line: number) => void): (() => void) => {
  const element = readScrollingElement(source);
  let frame = 0;
  const measure = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => report(readVisibleTopLine(source)));
  };
  measure();
  element?.addEventListener("scroll", measure, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    element?.removeEventListener("scroll", measure);
  };
};

export const useVisibleTopLine = (): number => {
  const editor = useMarkdownEditorContext("MarkdownOutline");
  const { controller, previewPanel, value } = editor;
  const [topLine, setTopLine] = useState(1);
  const readsPreview = readDisplayedView(editor) === "preview";
  useEffect(() => {
    if (!controller) return undefined;
    return followScroll({ controller, previewPanel, readsPreview }, setTopLine);
  }, [controller, previewPanel, readsPreview, value]);
  return topLine;
};
