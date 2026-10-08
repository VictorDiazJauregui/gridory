import { Bold } from "lucide-react";
import { expect, test } from "vitest";
import { DEFAULT_MARKDOWN_EDITOR_TEXTS } from "../components/markdown-editor/constants";
import { countFittingGroups } from "../components/markdown-editor/toolbar/fitting-groups";
import { resolveToolGroups, UnknownMarkdownToolError } from "../components/markdown-editor/tools/resolve-tools";
import { formatShortcut, normalizeShortcut, readShortcut } from "../components/markdown-editor/tools/shortcut-keys";
import type { MarkdownTool } from "../components/markdown-editor/tools/tool-types";

const TEXTS = DEFAULT_MARKDOWN_EDITOR_TEXTS.tools;
const CUSTOM_TOOL: MarkdownTool = { id: "custom", label: "Custom", icon: Bold, run: () => undefined };

const idsOf = (groups: MarkdownTool[][]) => groups.map((group) => group.map((tool) => tool.id));

test("resolves a preset into groups of tools", () => {
  expect(idsOf(resolveToolGroups("minimal", TEXTS))).toEqual([["undo", "redo"], ["bold", "italic"]]);
});

test("splits a list on separators, keeps custom tools and drops empty groups", () => {
  const groups = resolveToolGroups(["undo", "|", "|", CUSTOM_TOOL, "redo", "|"], TEXTS);
  expect(idsOf(groups)).toEqual([["undo"], ["custom", "redo"]]);
});

test("labels built-in tools with the given texts", () => {
  const [[undo]] = resolveToolGroups(["undo"], { ...TEXTS, undo: "Undo" });
  expect(undo.label).toBe("Undo");
});

test("fails with its own error on an unknown tool id", () => {
  expect(() => resolveToolGroups(["undo", "bolt" as never], TEXTS)).toThrow(UnknownMarkdownToolError);
});

test.each([
  { shortcut: "Mod-b", apple: "⌘B", other: "Ctrl+B" },
  { shortcut: "Mod-Shift-x", apple: "⌘⇧X", other: "Ctrl+Shift+X" },
  { shortcut: "Mod-Alt-1", apple: "⌘⌥1", other: "Ctrl+Alt+1" },
])("formats $shortcut for each platform", ({ shortcut, apple, other }) => {
  expect(formatShortcut(shortcut, true)).toBe(apple);
  expect(formatShortcut(shortcut, false)).toBe(other);
});

test("reads a key event as the same shortcut it was declared with", () => {
  const event = new KeyboardEvent("keydown", { code: "KeyF", key: "F", ctrlKey: true, shiftKey: true });
  expect(readShortcut(event, false)).toBe(normalizeShortcut("Mod-Shift-f"));
  expect(readShortcut(event, true)).toBe("Shift-f");
});

test.each([
  { name: "all groups fit", widths: [60, 80, 80], available: 220, expected: 3 },
  { name: "the overflow button takes room", widths: [60, 80, 80], available: 200, expected: 2 },
  { name: "only the first group fits", widths: [60, 80, 80], available: 150, expected: 1 },
  { name: "nothing but the overflow fits", widths: [60, 80], available: 50, expected: 0 },
])("countFittingGroups when $name", ({ widths, available, expected }) => {
  expect(countFittingGroups(widths, available, 34)).toBe(expected);
});
