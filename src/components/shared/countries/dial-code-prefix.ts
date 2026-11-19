import { findCountryByDialCode } from "./dial-code-lookup";

export interface LeadingDialCode {
  dialCode: string;
  /** What follows the dial code, untouched. */
  rest: string;
}

// E.164 country codes have at most three digits.
const MAX_DIAL_CODE_DIGITS = 3;
const LEADING_INTERNATIONAL_NUMBER = /^\s*\+(\d+)/;

/** The longest known dial code right after a leading "+": "+51987" is +51 and "987". */
export const matchLeadingDialCode = (text: string): LeadingDialCode | undefined => {
  const match = LEADING_INTERNATIONAL_NUMBER.exec(text);
  if (!match) return undefined;
  const digits = match[1];
  for (let length = Math.min(MAX_DIAL_CODE_DIGITS, digits.length); length > 0; length -= 1) {
    const dialCode = `+${digits.slice(0, length)}`;
    if (findCountryByDialCode(dialCode)) return { dialCode, rest: text.slice(match[0].length - digits.length + length) };
  }
  return undefined;
};
