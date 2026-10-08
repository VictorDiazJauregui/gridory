import { useDeferredValue, useMemo } from "react";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import { readMarkdownHeadings } from "../render/read-headings";

export const useDocumentHeadings = () => {
  const { value, renderOptions, formulas } = useMarkdownEditorContext("MarkdownOutline");
  const deferredValue = useDeferredValue(value);
  const math = Boolean(formulas);
  return useMemo(() => readMarkdownHeadings(deferredValue, renderOptions, { math }), [deferredValue, renderOptions, math]);
};
