import type { AuthFieldValue, AuthPhoneValue } from "../types";

export const EMPTY_AUTH_PHONE_VALUE: AuthPhoneValue = { country: null, number: "" };

export const isPhoneValue = (value: AuthFieldValue | undefined): value is AuthPhoneValue =>
  typeof value === "object" && value !== null;

/** A `tel` default given as a plain string keeps working: it becomes the number, with no country. */
export const toPhoneValue = (value: AuthFieldValue | undefined): AuthPhoneValue => {
  if (isPhoneValue(value)) return value;
  return { ...EMPTY_AUTH_PHONE_VALUE, number: typeof value === "string" ? value : "" };
};
