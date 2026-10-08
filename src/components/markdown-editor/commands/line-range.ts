import type { TextSelection } from "./command-types";

export interface SourceLine {
  from: number;
  text: string;
}

const findLineStart = (text: string, position: number): number => text.lastIndexOf("\n", position - 1) + 1;

const findLineEnd = (text: string, position: number): number => {
  const lineBreak = text.indexOf("\n", position);
  return lineBreak === -1 ? text.length : lineBreak;
};

export const readSelectedLines = (text: string, selection: TextSelection): SourceLine[] => {
  const start = findLineStart(text, selection.from);
  const end = findLineEnd(text, selection.to);
  let offset = start;
  return text
    .slice(start, end)
    .split("\n")
    .map((lineText) => {
      const line = { from: offset, text: lineText };
      offset += lineText.length + 1;
      return line;
    });
};
