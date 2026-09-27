import { createElement } from "react";
import type { ListboxOption, ListboxQueryMatcher } from "../listbox/listbox-props";
import { isCountryCode } from "./country-codes";
import type { CountryFlagSettings } from "./country-flag-url";
import type { Country } from "./country-list";
import { matchesCountryQuery } from "./country-search";
import { CountryFlag } from "./CountryFlag";
import { DIAL_CODE_BY_COUNTRY } from "./dial-codes";

export type CountryWithDialCode = Country & { dialCode: string };

const hasDialCode = (country: Country): country is CountryWithDialCode => Boolean(country.dialCode);

export const toCountryOption = (
  country: Country,
  flagSettings?: CountryFlagSettings,
): ListboxOption => ({
  value: country.code,
  label: country.name,
  leading: createElement(CountryFlag, { code: country.code, settings: flagSettings }),
});

export const toDialCodeOption = (
  country: CountryWithDialCode,
  flagSettings?: CountryFlagSettings,
): ListboxOption => ({ ...toCountryOption(country, flagSettings), trailing: country.dialCode });

export const buildDialCodeOptions = (
  countries: readonly Country[],
  flagSettings?: CountryFlagSettings,
): ListboxOption[] =>
  countries.filter(hasDialCode).map((country) => toDialCodeOption(country, flagSettings));

export const matchesCountryOption: ListboxQueryMatcher = (option, query) => {
  if (!isCountryCode(option.value)) return false;
  const country: Country = {
    code: option.value,
    name: option.label,
    dialCode: DIAL_CODE_BY_COUNTRY[option.value],
  };
  return matchesCountryQuery(country, query);
};
