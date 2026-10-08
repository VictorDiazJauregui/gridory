import { EditorSelection } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

const readVisibleDocumentTop = (view: EditorView): number => view.scrollDOM.getBoundingClientRect().top - view.documentTop;

export const readTopLine = (view: EditorView): number => {
  const visibleTop = Math.max(0, readVisibleDocumentTop(view));
  const block = view.lineBlockAtHeight(visibleTop);
  const lineNumber = view.state.doc.lineAt(block.from).number;
  const fraction = block.height > 0 ? (visibleTop - block.top) / block.height : 0;
  return lineNumber + Math.min(Math.max(fraction, 0), 1);
};

export const scrollToLine = (view: EditorView, line: number): void => {
  const lineNumber = Math.min(Math.max(Math.floor(line), 1), view.state.doc.lines);
  const block = view.lineBlockAt(view.state.doc.line(lineNumber).from);
  const targetTop = block.top + (line - lineNumber) * block.height;
  view.scrollDOM.scrollTop += targetTop - readVisibleDocumentTop(view);
};

const scrollToBottom = (element: HTMLElement): void => {
  element.scrollTop = element.scrollHeight;
};

export const scrollToDocumentEnd = (view: EditorView): void => {
  scrollToBottom(view.scrollDOM);
  view.requestMeasure({ read: () => null, write: () => scrollToBottom(view.scrollDOM) });
};

export const revealLine = (view: EditorView, line: number): void => {
  const target = view.state.doc.line(Math.min(Math.max(line, 1), view.state.doc.lines));
  view.dispatch({ selection: EditorSelection.cursor(target.from), effects: EditorView.scrollIntoView(target.from, { y: "start" }) });
};
