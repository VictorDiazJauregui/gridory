import { useMemo } from "react";
import { isCountryCode } from "../../shared/countries/country-codes";
import { matchesCountryOption } from "../../shared/countries/country-listbox-options";
import type { ListboxOption, ListboxQueryMatcher } from "../../shared/listbox/listbox-props";
import { includesNormalizedQuery, normalizeSearchText } from "../../shared/text-search/normalize-search-text";
import { COUNTRY_NOT_APPLICABLE } from "../not-applicable";
import { InvalidNotApplicableValueError } from "../validation/not-applicable-errors";

// The list option keeps its own value: the answer's value may be "" or anything the app chose.
export const NOT_APPLICABLE_OPTION_VALUE = "not-applicable-option";

interface NotApplicableSettings {
  notApplicableOption?: boolean;
  notApplicableValue?: string;
}

/** Value of the "no aplica" answer, or null while the option is off. Throws when it is a country code. */
export const resolveNotApplicableValue = ({ notApplicableOption, notApplicableValue }: NotApplicableSettings): string | null => {
  if (!notApplicableOption) return null;
  const value = notApplicableValue ?? COUNTRY_NOT_APPLICABLE;
  if (isCountryCode(value)) throw new InvalidNotApplicableValueError(value);
  return value;
};

// The answer has no ISO code nor dial code to search by: only its text.
export const matchesCountryOrNotApplicable: ListboxQueryMatcher = (option, query) => {
  if (option.value !== NOT_APPLICABLE_OPTION_VALUE) return matchesCountryOption(option, query);
  return includesNormalizedQuery(option.label, normalizeSearchText(query));
};

/** The values the listbox marks as chosen: the countries, and the "no aplica" option when it is the answer. */
export const listSelectedOptionValues = (selectedCodes: readonly string[], notApplicableChosen: boolean): string[] =>
  notApplicableChosen ? [NOT_APPLICABLE_OPTION_VALUE, ...selectedCodes] : [...selectedCodes];

/** Memoized like the countries, so the listbox does not filter again on every render. First, without a flag. */
export const useOptionsWithNotApplicable = (countryOptions: ListboxOption[], notApplicableLabel: string | null) =>
  useMemo(() => {
    if (notApplicableLabel === null) return countryOptions;
    return [{ value: NOT_APPLICABLE_OPTION_VALUE, label: notApplicableLabel }, ...countryOptions];
  }, [countryOptions, notApplicableLabel]);
