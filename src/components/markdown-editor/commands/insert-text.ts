import type { MarkdownCommand } from "./command-types";

export const insertText =
  (text: string): MarkdownCommand =>
  ({ selection }) => ({
    changes: [{ from: selection.from, to: selection.to, insert: text }],
    selection: { from: selection.from + text.length, to: selection.from + text.length },
  });

export const replaceDocument: MarkdownCommand = ({ text }) => ({
  changes: [{ from: 0, to: text.length, insert: "" }],
  selection: { from: 0, to: 0 },
});

export const insertTextAt =
  (position: number, text: string): MarkdownCommand =>
  () => ({
    changes: [{ from: position, to: position, insert: text }],
    selection: { from: position + text.length, to: position + text.length },
  });
