import { COUNTRY_CODES, type CountryCode } from "./country-codes";
import { DIAL_CODE_BY_COUNTRY } from "./dial-codes";

export interface Country {
  code: CountryCode;
  name: string;
  dialCode?: string;
}

const DEFAULT_LOCALE = "es";

// Building and sorting the 249 localized rows is not free, and every select renders them: one
// list per locale is kept for the lifetime of the page.
const countryListByLocale = new Map<string, readonly Country[]>();

const createCountry = (code: CountryCode, regionNames: Intl.DisplayNames): Country => ({
  code,
  name: regionNames.of(code) ?? code,
  dialCode: DIAL_CODE_BY_COUNTRY[code],
});

const createCountryList = (locale: string): readonly Country[] => {
  const regionNames = new Intl.DisplayNames([locale], { type: "region" });
  return COUNTRY_CODES.map((code) => createCountry(code, regionNames)).sort((first, second) =>
    first.name.localeCompare(second.name, locale),
  );
};

export const buildCountryList = (locale: string = DEFAULT_LOCALE): readonly Country[] => {
  const cachedCountryList = countryListByLocale.get(locale);
  if (cachedCountryList) return cachedCountryList;
  const countryList = createCountryList(locale);
  countryListByLocale.set(locale, countryList);
  return countryList;
};
