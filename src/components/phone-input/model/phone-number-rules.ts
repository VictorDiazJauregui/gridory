const DISALLOWED_PHONE_CHARACTERS = /[^\d +-]/gu;

// Applied to the whole value, so pasted text follows the same rule as typed text: letters, accented or not,
// symbols and emoji are dropped.
export const sanitizePhoneNumber = (text: string): string => text.replace(DISALLOWED_PHONE_CHARACTERS, "");
