import type { CountryCode } from "../../shared/countries/country-codes";
import { getDialCode } from "../../shared/countries/country-lookup";
import { findCountryByDialCode } from "../../shared/countries/dial-code-lookup";
import { matchLeadingDialCode } from "../../shared/countries/dial-code-prefix";
import type { PhoneInputValue, PhoneNumberCharacters } from "../types";
import { limitNumberLength } from "./number-length-limit";
import { sanitizePhoneNumber } from "./phone-number-rules";

export interface PastedNumberRules {
  characters: PhoneNumberCharacters;
  maxLength: number | undefined;
}

interface PasteTarget {
  country: CountryCode | null;
  rules: PastedNumberRules;
}

const LEADING_SEPARATORS = /^[\s-]+/;

// Canada chosen and "+1 …" pasted stays Canada: only a country without that dial code gives way.
const resolvePastedCountry = (dialCode: string, currentCountry: CountryCode | null): CountryCode | undefined => {
  if (currentCountry && getDialCode(currentCountry) === dialCode) return currentCountry;
  return findCountryByDialCode(dialCode);
};

/** Country and local number of a pasted "+51 987…", or nothing when it does not start with a known dial code. */
export const splitPastedInternationalNumber = (pasted: string, target: PasteTarget): PhoneInputValue | undefined => {
  const leading = matchLeadingDialCode(pasted);
  const country = leading && resolvePastedCountry(leading.dialCode, target.country);
  if (!leading || !country) return undefined;
  const localNumber = sanitizePhoneNumber(leading.rest, target.rules.characters).replace(LEADING_SEPARATORS, "");
  const number = limitNumberLength({ next: localNumber, current: "", max: target.rules.maxLength });
  return { country, number: number ?? "" };
};
