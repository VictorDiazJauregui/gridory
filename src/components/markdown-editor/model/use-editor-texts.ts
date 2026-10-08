import { useMemo } from "react";
import { DEFAULT_MARKDOWN_EDITOR_TEXTS } from "../constants";
import type { MarkdownDialogTexts, MarkdownEditorProviderProps, MarkdownEditorTexts } from "../types";

type TextOverrides = NonNullable<MarkdownEditorProviderProps["texts"]>;

const DIALOG_TEXT_GROUPS = ["link", "reference", "image", "code", "table", "emoji", "diagram"] as const;

const mergeDialogTexts = (overrides: TextOverrides["dialogs"] = {}): MarkdownDialogTexts => {
  const defaults = DEFAULT_MARKDOWN_EDITOR_TEXTS.dialogs;
  const groups = Object.fromEntries(DIALOG_TEXT_GROUPS.map((group) => [group, { ...defaults[group], ...overrides[group] }]));
  return { ...defaults, ...overrides, ...groups } as MarkdownDialogTexts;
};

const mergeEditorTexts = (texts: TextOverrides = {}): MarkdownEditorTexts => ({
  ...DEFAULT_MARKDOWN_EDITOR_TEXTS,
  ...texts,
  viewLabels: { ...DEFAULT_MARKDOWN_EDITOR_TEXTS.viewLabels, ...texts.viewLabels },
  clearDialog: { ...DEFAULT_MARKDOWN_EDITOR_TEXTS.clearDialog, ...texts.clearDialog },
  search: { ...DEFAULT_MARKDOWN_EDITOR_TEXTS.search, ...texts.search },
  outline: { ...DEFAULT_MARKDOWN_EDITOR_TEXTS.outline, ...texts.outline },
  dialogs: mergeDialogTexts(texts.dialogs),
  tools: {
    ...DEFAULT_MARKDOWN_EDITOR_TEXTS.tools,
    ...texts.tools,
    alertVariants: { ...DEFAULT_MARKDOWN_EDITOR_TEXTS.tools.alertVariants, ...texts.tools?.alertVariants },
  },
});

export const useEditorTexts = (texts: MarkdownEditorProviderProps["texts"]): MarkdownEditorTexts =>
  useMemo(() => mergeEditorTexts(texts), [texts]);
