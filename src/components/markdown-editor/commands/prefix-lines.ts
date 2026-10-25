import type { CommandResult, MarkdownCommand, TextChange } from "./command-types";
import { readSelectedLines, type SourceLine } from "./line-range";

export type LinePrefix = string | ((lineIndex: number) => string);

export interface PrefixRules {
  /** A line already carries this prefix: when every selected line does, the command removes it. */
  present: RegExp;
  /** Rival prefixes replaced instead of stacked (a `##` over a `#`, a bullet over a number). */
  rivals?: RegExp;
}

const resolvePrefix = (prefix: LinePrefix, lineIndex: number): string =>
  typeof prefix === "function" ? prefix(lineIndex) : prefix;

const removePrefix = (line: SourceLine, rules: PrefixRules): TextChange => {
  const length = rules.present.exec(line.text)?.[0].length ?? 0;
  return { from: line.from, to: line.from + length, insert: "" };
};

const replaceRival = (line: SourceLine, insert: string, rules: PrefixRules): TextChange => {
  const rivalLength = rules.rivals?.exec(line.text)?.[0].length ?? 0;
  return { from: line.from, to: line.from + rivalLength, insert };
};

const buildChanges = (lines: SourceLine[], prefix: LinePrefix, rules: PrefixRules): TextChange[] => {
  const editableLines = lines.filter((line) => line.text.trim() !== "" || lines.length === 1);
  if (editableLines.every((line) => rules.present.test(line.text))) {
    return editableLines.map((line) => removePrefix(line, rules));
  }
  return editableLines.map((line, index) => replaceRival(line, resolvePrefix(prefix, index), rules));
};

const selectChangedLines = (lines: SourceLine[], changes: TextChange[]): CommandResult["selection"] => {
  const delta = changes.reduce((total, change) => total + change.insert.length - (change.to - change.from), 0);
  const last = lines[lines.length - 1];
  return { from: lines[0].from, to: last.from + last.text.length + delta };
};

export const prefixLines =
  (prefix: LinePrefix, rules: PrefixRules): MarkdownCommand =>
  ({ text, selection }) => {
    const lines = readSelectedLines(text, selection);
    const changes = buildChanges(lines, prefix, rules);
    return { changes, selection: selectChangedLines(lines, changes) };
  };
