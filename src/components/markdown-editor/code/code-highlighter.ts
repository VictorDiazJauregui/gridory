import type { HLJSApi } from "highlight.js";
import type { PreviewEnhancer } from "../preview/preview-enhancer";
import { findCodeLanguage, type MarkdownCodeLanguage } from "./code-languages";

let highlighterCore: Promise<HLJSApi> | undefined;

const loadHighlighterCore = (): Promise<HLJSApi> => {
  highlighterCore ??= import("highlight.js/lib/core").then((module) => module.default);
  return highlighterCore;
};

const registerLanguage = async (highlighter: HLJSApi, language: MarkdownCodeLanguage & Required<Pick<MarkdownCodeLanguage, "load">>) => {
  if (highlighter.getLanguage(language.id)) return;
  highlighter.registerLanguage(language.id, (await language.load()).default);
};

const highlightBlock = async (block: HTMLElement, languages: readonly MarkdownCodeLanguage[]): Promise<void> => {
  const language = findCodeLanguage(languages, block.parentElement?.dataset.language ?? "");
  if (!language?.load) return;
  const highlighter = await loadHighlighterCore();
  await registerLanguage(highlighter, { ...language, load: language.load });
  if (!block.isConnected) return;
  block.innerHTML = highlighter.highlight(block.textContent ?? "", { language: language.id, ignoreIllegals: true }).value;
  block.dataset.highlighted = "true";
};

export const createCodeHighlighter =
  (languages: readonly MarkdownCodeLanguage[]): PreviewEnhancer =>
  (previewRoot) => {
    previewRoot
      .querySelectorAll<HTMLElement>("pre[data-language] > code:not([data-highlighted])")
      .forEach((block) => void highlightBlock(block, languages));
  };
