const DISALLOWED_PHONE_CHARACTERS = /[^\d +-]/gu;

/**
 * Keeps digits, spaces, hyphens and "+", and drops everything else: letters
 * with or without accents, symbols and emoji. Applied to the whole value, so
 * pasted text follows the same rule as typed text.
 */
export const sanitizePhoneNumber = (text: string): string => text.replace(DISALLOWED_PHONE_CHARACTERS, "");
