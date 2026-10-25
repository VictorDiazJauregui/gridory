import { DEFAULT_MARKDOWN_RENDER_TEXTS } from "../constants";
import type { MarkdownRenderOptions, MarkdownRenderTexts } from "../types";

export type MarkdownRenderEnvironment = {
  texts: MarkdownRenderTexts;
  headingIdPrefix: string;
  docId?: string;
  openExternalLinksInNewTab: boolean;
};

export const mergeRenderTexts = (texts: MarkdownRenderOptions["texts"] = {}): MarkdownRenderTexts => ({
  ...DEFAULT_MARKDOWN_RENDER_TEXTS,
  ...texts,
  alertTitles: { ...DEFAULT_MARKDOWN_RENDER_TEXTS.alertTitles, ...texts.alertTitles },
  diagram: { ...DEFAULT_MARKDOWN_RENDER_TEXTS.diagram, ...texts.diagram },
  formula: { ...DEFAULT_MARKDOWN_RENDER_TEXTS.formula, ...texts.formula },
});

export const createRenderEnvironment = (options: MarkdownRenderOptions): MarkdownRenderEnvironment => ({
  texts: mergeRenderTexts(options.texts),
  headingIdPrefix: options.idPrefix ? `${options.idPrefix}-` : "",
  docId: options.idPrefix,
  openExternalLinksInNewTab: options.openExternalLinksInNewTab ?? true,
});

export const readRenderEnvironment = (environment: unknown): MarkdownRenderEnvironment =>
  (environment as MarkdownRenderEnvironment | undefined) ?? createRenderEnvironment({});
