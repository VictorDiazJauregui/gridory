import type { TextChange } from "../commands/command-types";

const countCommonPrefix = (first: string, second: string): number => {
  const limit = Math.min(first.length, second.length);
  let length = 0;
  while (length < limit && first[length] === second[length]) length += 1;
  return length;
};

const countCommonSuffix = (first: string, second: string, prefixLength: number): number => {
  const limit = Math.min(first.length, second.length) - prefixLength;
  let length = 0;
  while (length < limit && first[first.length - 1 - length] === second[second.length - 1 - length]) length += 1;
  return length;
};

export const findMinimalChange = (current: string, next: string): TextChange => {
  const prefixLength = countCommonPrefix(current, next);
  const suffixLength = countCommonSuffix(current, next, prefixLength);
  return { from: prefixLength, to: current.length - suffixLength, insert: next.slice(prefixLength, next.length - suffixLength) };
};
