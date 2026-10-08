import type { MarkdownCommand } from "./command-types";

export type TextCase = "upper" | "lower" | "words";

const WORD_START = /(^|[^\p{L}\p{N}'’])(\p{L})/gu;

const capitalizeWords = (text: string): string =>
  text.toLowerCase().replace(WORD_START, (_, boundary: string, letter: string) => boundary + letter.toUpperCase());

const CASE_TRANSFORMS: Record<TextCase, (text: string) => string> = {
  upper: (text) => text.toUpperCase(),
  lower: (text) => text.toLowerCase(),
  words: capitalizeWords,
};

export const transformCase =
  (textCase: TextCase): MarkdownCommand =>
  ({ text, selection }) => {
    const transformed = CASE_TRANSFORMS[textCase](text.slice(selection.from, selection.to));
    return {
      changes: [{ from: selection.from, to: selection.to, insert: transformed }],
      selection: { from: selection.from, to: selection.from + transformed.length },
    };
  };
