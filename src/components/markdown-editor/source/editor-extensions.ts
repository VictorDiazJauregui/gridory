import { history, historyKeymap, defaultKeymap, redoDepth, undoDepth } from "@codemirror/commands";
import { Prec, type Extension } from "@codemirror/state";
import { EditorView, keymap, placeholder, type ViewUpdate } from "@codemirror/view";
import type { EditorHistoryState } from "../model/markdown-editor-context";
import type { MarkdownSearchTexts } from "../types";
import { createImageDropHandlers, type ImageFilesHandler } from "./image-drop-handlers";
import { createMarkdownSupport } from "./markdown-language";
import { createSearchExtensions } from "./search-panel";
import { createSourceHighlighting } from "./source-highlight-style";
import { createSourceTheme } from "./source-theme";

export interface EditorListeners {
  onDocumentChange: (value: string) => void;
  onHistoryChange: (history: EditorHistoryState) => void;
  /** Runs the tool bound to a key combination; true when one ran. */
  onShortcut: (event: KeyboardEvent) => boolean;
  /** Takes pasted or dropped image files; true when the app uploads them. */
  onImageFiles: ImageFilesHandler;
}

export interface EditorExtensionOptions {
  label: string;
  placeholderText: string;
  searchTexts: MarkdownSearchTexts;
  readListeners: () => EditorListeners;
}

const notifyListeners = (update: ViewUpdate, listeners: EditorListeners): void => {
  if (update.docChanged) listeners.onDocumentChange(update.state.doc.toString());
  listeners.onHistoryChange({ canUndo: undoDepth(update.state) > 0, canRedo: redoDepth(update.state) > 0 });
};

export const createEditorExtensions = ({ label, placeholderText, searchTexts, readListeners }: EditorExtensionOptions): Extension[] => [
  history(),
  keymap.of([...defaultKeymap, ...historyKeymap]),
  createMarkdownSupport(),
  ...createSearchExtensions(searchTexts),
  createSourceHighlighting(),
  createSourceTheme(),
  EditorView.lineWrapping,
  placeholder(placeholderText),
  EditorView.contentAttributes.of({ "aria-label": label }),
  EditorView.updateListener.of((update) => notifyListeners(update, readListeners())),
  Prec.highest(keymap.of([{ any: (_, event) => readListeners().onShortcut(event) }])),
  createImageDropHandlers(() => readListeners().onImageFiles),
];
