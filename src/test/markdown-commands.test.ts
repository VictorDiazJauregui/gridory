import { expect, test } from "vitest";
import type { EditorSnapshot, MarkdownCommand } from "../components/markdown-editor/commands/command-types";
import { insertBlock } from "../components/markdown-editor/commands/insert-block";
import { markdownCommands } from "../components/markdown-editor/commands/markdown-commands";
import { prefixLines } from "../components/markdown-editor/commands/prefix-lines";
import { transformCase } from "../components/markdown-editor/commands/transform-case";
import { wrapSelection } from "../components/markdown-editor/commands/wrap-selection";
import { findMinimalChange } from "../components/markdown-editor/source/minimal-change";

const HEADING_RIVALS = /^#{1,6}\s+/;
const LIST_RIVALS = /^(?:[-*+]|\d+\.)\s+/;
const heading2 = prefixLines("## ", { present: /^##\s/, rivals: HEADING_RIVALS });
const bullets = prefixLines("- ", { present: /^[-*+]\s/, rivals: LIST_RIVALS });
const numbered = prefixLines((index) => `${index + 1}. `, { present: /^\d+\.\s/, rivals: LIST_RIVALS });

const SELECTION_START = "«";
const SELECTION_END = "»";

const snapshotOf = (marked: string): EditorSnapshot => {
  const from = marked.indexOf(SELECTION_START);
  const to = marked.indexOf(SELECTION_END) - 1;
  return { text: marked.replace(SELECTION_START, "").replace(SELECTION_END, ""), selection: { from, to } };
};

const run = (command: MarkdownCommand, marked: string): string => {
  const snapshot = snapshotOf(marked);
  const result = command(snapshot);
  const sorted = [...result.changes].sort((first, second) => second.from - first.from);
  const text = sorted.reduce((current, change) => current.slice(0, change.from) + change.insert + current.slice(change.to), snapshot.text);
  const selected = text.slice(result.selection.from, result.selection.to);
  return `${text.slice(0, result.selection.from)}${SELECTION_START}${selected}${SELECTION_END}${text.slice(result.selection.to)}`;
};

test.each([
  ["wraps the selection", wrapSelection("**"), "a «word» b", "a **«word»** b"],
  ["leaves the cursor between the markers", wrapSelection("**"), "a «» b", "a **«»** b"],
  ["removes markers around the selection", wrapSelection("**"), "a **«word»** b", "a «word» b"],
  ["removes markers inside the selection", wrapSelection("~~"), "a «~~word~~» b", "a «word» b"],
  ["adds italic inside bold", wrapSelection("*"), "**«word»**", "***«word»***"],
  ["removes italic and keeps bold", wrapSelection("*"), "***«word»***", "**«word»**"],
  ["removes bold and keeps italic", wrapSelection("**"), "***«word»***", "*«word»*"],
  ["does not take bold for italic", wrapSelection("*"), "**«word»**", "***«word»***"],
  ["wraps inline code", wrapSelection("`"), "run «npm i»", "run `«npm i»`"],
])("wrapSelection %s", (...[, command, before, after]) => {
  expect(run(command, before)).toBe(after);
});

test.each([
  ["adds a heading", heading2, "Ti«t»le", "«## Title»"],
  ["replaces a rival heading level", heading2, "# Ti«t»le", "«## Title»"],
  ["removes the same heading level", heading2, "## Ti«t»le", "«Title»"],
  ["prefixes every selected line", bullets, "«one\ntwo»", "«- one\n- two»"],
  ["skips blank lines in a multi-line selection", bullets, "«one\n\ntwo»", "«- one\n\n- two»"],
  ["numbers the lines", numbered, "«one\ntwo»", "«1. one\n2. two»"],
  ["turns a numbered list into bullets", bullets, "«1. one\n2. two»", "«- one\n- two»"],
  ["removes bullets when every line has them", bullets, "«- one\n- two»", "«one\ntwo»"],
])("prefixLines %s", (...[, command, before, after]) => {
  expect(run(command, before)).toBe(after);
});

test.each([
  ["upper", "a «Mixed text» b", "a «MIXED TEXT» b"],
  ["lower", "«MIXED Text»", "«mixed text»"],
  ["words", "«hola MUNDO. otra frase-compuesta»", "«Hola Mundo. Otra Frase-Compuesta»"],
  ["words", "«l'été ñandú»", "«L'été Ñandú»"],
] as const)("transformCase %s", (textCase, before, after) => {
  expect(run(transformCase(textCase), before)).toBe(after);
});

test.each([
  ["pads the block with blank lines", "one«»two", "one\n\n---\n\n«»two"],
  ["does not duplicate existing blank lines", "one\n\n«»\n\ntwo", "one\n\n---\n\n«»two"],
  ["starts a document without leading lines", "«»", "---\n\n«»"],
  ["replaces the selection", "one\n\n«old»", "one\n\n---\n\n«»"],
])("insertBlock %s", (_, before, after) => {
  expect(run(insertBlock({ text: "---" }), before)).toBe(after);
});

test("insertBlock places the cursor inside the block when asked", () => {
  expect(run(insertBlock({ text: "| a |", cursor: 2 }), "«»")).toBe("| «»a |\n\n");
});

test.each([
  { name: "an append at the end", current: "first!", next: "first! (saved)", change: { from: 6, to: 6, insert: " (saved)" } },
  { name: "a replacement in the middle", current: "a bc d", next: "a XY d", change: { from: 2, to: 4, insert: "XY" } },
  { name: "a deletion", current: "abc", next: "ac", change: { from: 1, to: 2, insert: "" } },
])("findMinimalChange keeps only $name", ({ current, next, change }) => {
  expect(findMinimalChange(current, next)).toEqual(change);
});

test.each([
  { name: "turns bullets into tasks", command: markdownCommands.taskList, before: "«- one\n- two»", after: "«- [ ] one\n- [ ] two»" },
  { name: "turns tasks into bullets", command: markdownCommands.bulletList, before: "«- [ ] one\n- [x] two»", after: "«- one\n- two»" },
  { name: "removes tasks when every line has one", command: markdownCommands.taskList, before: "«- [ ] one»", after: "«one»" },
  { name: "sets any heading level", command: markdownCommands.heading(6), before: "## Ti«t»le", after: "«###### Title»" },
  { name: "wraps the selected lines in an alert", command: markdownCommands.alert("warning"), before: "intro\n\n«a\nb»", after: "intro\n\n> [!WARNING]\n> a\n> b«»\n\n" },
  { name: "inserts an empty alert", command: markdownCommands.alert("success"), before: "«»", after: "> [!TIP]\n> «»\n\n" },
])("markdownCommands $name", ({ command, before, after }) => {
  expect(run(command, before)).toBe(after);
});
