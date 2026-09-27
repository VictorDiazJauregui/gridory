import type { CountryCode } from "../../shared/countries/country-codes";
import { InvalidSelectionRangeError } from "../validation/selection-range-errors";

/** Bounds of a multiple selection. A missing maximum is `Infinity`. */
export interface SelectionRange {
  minSelected: number;
  maxSelected: number;
}

export const assertValidSelectionRange = (range: SelectionRange): void => {
  if (range.minSelected <= range.maxSelected) return;
  throw new InvalidSelectionRangeError(range.minSelected, range.maxSelected);
};

export const hasReachedMaximum = (count: number, range: SelectionRange): boolean =>
  count >= range.maxSelected;

// An empty selection is not "below the minimum": whether it is an error depends on `required`.
export const isBelowMinimum = (count: number, range: SelectionRange): boolean =>
  count > 0 && count < range.minSelected;

/** Removes the country when chosen, appends it otherwise unless the maximum is reached. Never mutates. */
export const toggleCountry = (
  selected: readonly CountryCode[],
  code: CountryCode,
  range: SelectionRange,
): CountryCode[] => {
  if (selected.includes(code)) return selected.filter((selectedCode) => selectedCode !== code);
  if (hasReachedMaximum(selected.length, range)) return [...selected];
  return [...selected, code];
};
