import { EditorState } from "@codemirror/state";
import { gotoLine, openSearchPanel } from "@codemirror/search";
import { EditorView } from "@codemirror/view";
import type { EditorController } from "../model/editor-controller";
import { createEditorExtensions, type EditorExtensionOptions } from "./editor-extensions";
import { readTopLine, revealLine, scrollToDocumentEnd, scrollToLine } from "./editor-scroll";
import { openReplacePanel } from "./search-panel";
import { applyCommand, redoInView, syncViewValue, undoInView } from "./editor-view-actions";

export interface CodeMirrorControllerOptions extends EditorExtensionOptions {
  parent: HTMLElement;
  initialValue: string;
}

const createScrollActions = (view: EditorView): Pick<EditorController, "scrollElement" | "readTopLine" | "scrollToLine" | "revealLine" | "scrollToEnd"> => ({
  scrollElement: view.scrollDOM,
  readTopLine: () => readTopLine(view),
  scrollToLine: (line) => scrollToLine(view, line),
  revealLine: (line) => revealLine(view, line),
  scrollToEnd: () => scrollToDocumentEnd(view),
});

export const createCodeMirrorController = ({ parent, initialValue, ...extensionOptions }: CodeMirrorControllerOptions): EditorController => {
  const state = EditorState.create({ doc: initialValue, extensions: createEditorExtensions(extensionOptions) });
  const view = new EditorView({ state, parent });
  return {
    ...createScrollActions(view),
    apply: (command) => applyCommand(view, command),
    undo: () => undoInView(view),
    redo: () => redoInView(view),
    focus: () => view.focus(),
    syncValue: (value) => syncViewValue(view, value),
    openSearch: () => openSearchPanel(view),
    openReplace: () => openReplacePanel(view),
    openGoToLine: () => gotoLine(view),
    readSelectedText: () => view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to),
    destroy: () => view.destroy(),
  };
};
