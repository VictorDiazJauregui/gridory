const COMBINING_MARKS = /\p{Mark}/gu;
const WHITESPACE_RUNS = /\s+/g;

export const normalizeSearchText = (text: string): string =>
  text
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(WHITESPACE_RUNS, " ")
    .trim();

export const includesNormalizedQuery = (text: string, normalizedQuery: string): boolean =>
  normalizeSearchText(text).includes(normalizedQuery);
