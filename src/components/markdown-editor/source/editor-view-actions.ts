import { redo, undo } from "@codemirror/commands";
import { EditorSelection, Transaction } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import type { MarkdownCommand } from "../commands/command-types";
import { findMinimalChange } from "./minimal-change";

export const applyCommand = (view: EditorView, command: MarkdownCommand): void => {
  const { from, to } = view.state.selection.main;
  const result = command({ text: view.state.doc.toString(), selection: { from, to } });
  view.dispatch({
    changes: [...result.changes].sort((first, second) => first.from - second.from),
    selection: EditorSelection.range(result.selection.from, result.selection.to),
    scrollIntoView: true,
    userEvent: "input.format",
  });
  view.focus();
};

export const undoInView = (view: EditorView): void => {
  undo(view);
  view.focus();
};

export const redoInView = (view: EditorView): void => {
  redo(view);
  view.focus();
};

export const syncViewValue = (view: EditorView, value: string): void => {
  const currentValue = view.state.doc.toString();
  if (currentValue === value) return;
  view.dispatch({ changes: findMinimalChange(currentValue, value), annotations: Transaction.addToHistory.of(false) });
};
