import type { PhoneNumberCharacters } from "../types";

const DISALLOWED_CHARACTERS: Record<PhoneNumberCharacters, RegExp> = {
  phone: /[^\d +-]/gu,
  digits: /\D/gu,
};

// Applied to the whole value, so pasted text follows the same rule as typed text: letters, accented or not,
// symbols and emoji are dropped.
export const sanitizePhoneNumber = (text: string, characters: PhoneNumberCharacters = "phone"): string =>
  text.replace(DISALLOWED_CHARACTERS[characters], "");
