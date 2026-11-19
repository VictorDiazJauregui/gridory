import type { CountryCode } from "./country-codes";
import { buildCountryList, type Country } from "./country-list";
import { DIAL_CODE_BY_COUNTRY } from "./dial-codes";

/** Name of the country in `locale` ("es" by default), from Intl. The code itself when the browser has no name. */
export const getCountryName = (code: CountryCode, locale?: string): string =>
  buildCountryList(locale).find((country) => country.code === code)?.name ?? code;

/** Calling code with its "+", such as "+51". BV, HM and TF have none. */
export const getDialCode = (code: CountryCode): string | undefined => DIAL_CODE_BY_COUNTRY[code];

/** Every country with its localized name and dial code, sorted by name. The same array on every call. */
export const listCountries = (locale?: string): readonly Country[] => buildCountryList(locale);
