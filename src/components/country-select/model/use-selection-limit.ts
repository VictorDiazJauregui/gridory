import { useMemo } from "react";
import type { ListboxOption } from "../../shared/listbox/listbox-props";
import type { CountryCode, CountrySelectTexts } from "../types";
import { fillTextTemplate } from "./fill-text-template";
import { hasReachedMaximum, type SelectionRange } from "./selection-range";

interface SelectionLimitInput {
  multiple: boolean;
  range: SelectionRange;
  selectedCodes: readonly CountryCode[];
  options: ListboxOption[];
  texts: Pick<CountrySelectTexts, "maxReached">;
}

const disableUnchosenOptions = (options: ListboxOption[], chosenValues: readonly string[]): ListboxOption[] =>
  options.map((option) => (chosenValues.includes(option.value) ? option : { ...option, disabled: true }));

/** At the maximum, the countries left out cannot be picked and the status says why. Removing one lifts it. */
export const useSelectionLimit = ({ multiple, range, selectedCodes, options, texts }: SelectionLimitInput) => {
  const limitReached = multiple && hasReachedMaximum(selectedCodes.length, range);
  const listOptions = useMemo(
    () => (limitReached ? disableUnchosenOptions(options, selectedCodes) : options),
    [limitReached, options, selectedCodes],
  );
  const limitMessage = limitReached ? fillTextTemplate(texts.maxReached, { max: range.maxSelected }) : null;
  return { listOptions, limitMessage };
};
