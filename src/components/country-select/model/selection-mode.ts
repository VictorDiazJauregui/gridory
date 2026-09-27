import { COUNTRY_SELECT_DEFAULTS } from "../constants";
import type { CountrySelectProps } from "../types";
import { assertValidSelectionRange, type SelectionRange } from "./selection-range";

// The single mode is a selection of exactly one country at most.
const SINGLE_SELECTION_RANGE: SelectionRange = { minSelected: 1, maxSelected: 1 };

/** Bounds of the selection; throws InvalidSelectionRangeError when the minimum exceeds the maximum. */
export const resolveSelectionRange = (props: CountrySelectProps): SelectionRange => {
  if (!props.multiple) return SINGLE_SELECTION_RANGE;
  const range = {
    minSelected: props.minSelected ?? COUNTRY_SELECT_DEFAULTS.minSelected,
    maxSelected: props.maxSelected ?? Infinity,
  };
  assertValidSelectionRange(range);
  return range;
};
