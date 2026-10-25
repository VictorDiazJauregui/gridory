import { closeSearchPanel, findNext, findPrevious, gotoLine, openSearchPanel, search } from "@codemirror/search";
import { EditorState, type Extension } from "@codemirror/state";
import { keymap, type EditorView } from "@codemirror/view";
import type { MarkdownSearchTexts } from "../types";

const toPhrases = (texts: MarkdownSearchTexts): Record<string, string> => ({
  Find: texts.find,
  Replace: texts.replace,
  next: texts.next,
  previous: texts.previous,
  all: texts.all,
  "match case": texts.matchCase,
  regexp: texts.regexp,
  "by word": texts.byWord,
  replace: texts.replaceOne,
  "replace all": texts.replaceAll,
  close: texts.close,
  "Go to line": texts.goToLine,
  go: texts.go,
  "current match": texts.currentMatch,
  "on line": texts.onLine,
  "replaced match on line $": texts.replacedMatchOnLine,
  "replaced $ matches": texts.replacedMatches,
});

export const openReplacePanel = (view: EditorView): boolean => {
  openSearchPanel(view);
  view.dom.querySelector<HTMLInputElement>(".cm-search input[name=replace]")?.focus();
  return true;
};

export const createSearchExtensions = (texts: MarkdownSearchTexts): Extension[] => [
  search({ top: true }),
  EditorState.phrases.of(toPhrases(texts)),
  keymap.of([
    { key: "Mod-f", run: openSearchPanel, scope: "editor search-panel" },
    { key: "Mod-h", run: openReplacePanel, scope: "editor search-panel" },
    { key: "Mod-g", run: gotoLine },
    { key: "F3", run: findNext, shift: findPrevious, scope: "editor search-panel" },
    { key: "Enter", run: findNext, shift: findPrevious, scope: "search-panel" },
    { key: "Escape", run: closeSearchPanel, scope: "editor search-panel" },
  ]),
];
