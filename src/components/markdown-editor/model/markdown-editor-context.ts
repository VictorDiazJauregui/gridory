import { createContext, useContext } from "react";
import type { MarkdownEditorLimits, MarkdownEditorState, MarkdownEditorTexts, MarkdownRenderOptions } from "../types";
import type { MarkdownCodeLanguage } from "../code/code-languages";
import type { MarkdownDiagramTemplate } from "../diagrams/diagram-templates";
import type { MarkdownDiagramRenderer } from "../diagrams/diagram-types";
import type { MarkdownFormulaRenderer } from "../formulas/formula-types";
import type { MarkdownGuideConfig } from "../guide/guide-types";
import type { ImageUploadHandler, ImageUploadRules, MarkdownDialogComponents } from "../dialogs/dialog-types";
import type { MarkdownTool } from "../tools/tool-types";
import type { ShortcutRunner } from "../tools/tool-shortcuts";
import type { EditorController } from "./editor-controller";
import type { NarrowLayoutState } from "./use-narrow-layout";

export interface EditorHistoryState {
  canUndo: boolean;
  canRedo: boolean;
}

export interface EmojiHistory {
  recentEmojis: readonly string[];
  rememberEmoji: (emoji: string) => void;
}

export interface MarkdownEditorContextValue extends MarkdownEditorState, NarrowLayoutState {
  texts: MarkdownEditorTexts;
  renderOptions?: MarkdownRenderOptions;
  controller: EditorController | null;
  editorState: MarkdownEditorState;
  toolGroups: MarkdownTool[][];
  runShortcut: ShortcutRunner;
  activeDialog: string | null;
  dialogSelectedText: string;
  dialogReturnFocus: HTMLElement | null;
  closeDialog: () => void;
  dialogs?: Partial<MarkdownDialogComponents>;
  diagrams?: MarkdownDiagramRenderer;
  diagramTemplates: readonly MarkdownDiagramTemplate[];
  formulas?: MarkdownFormulaRenderer;
  guide: MarkdownGuideConfig;
  imageUpload: { handler?: ImageUploadHandler; rules: ImageUploadRules };
  codeLanguages: readonly MarkdownCodeLanguage[];
  limits: MarkdownEditorLimits;
  emojiHistory: EmojiHistory;
  /** The element that scrolls the preview, once `MarkdownPanels` renders it. */
  previewPanel: HTMLElement | null;
  attachPreviewPanel: (panel: HTMLElement | null) => void;
  changeValue: (value: string) => void;
  changeHistory: (history: EditorHistoryState) => void;
  attachController: (controller: EditorController | null) => void;
}

export class MissingMarkdownEditorProviderError extends Error {
  constructor(consumer: string) {
    super(`${consumer} must be rendered inside <MarkdownEditorProvider>`);
    this.name = "MissingMarkdownEditorProviderError";
  }
}

export const MarkdownEditorContext = createContext<MarkdownEditorContextValue | null>(null);

export const useMarkdownEditorContext = (consumer: string): MarkdownEditorContextValue => {
  const context = useContext(MarkdownEditorContext);
  if (!context) throw new MissingMarkdownEditorProviderError(consumer);
  return context;
};

export const useMarkdownEditor = (): MarkdownEditorState => useMarkdownEditorContext("useMarkdownEditor").editorState;
