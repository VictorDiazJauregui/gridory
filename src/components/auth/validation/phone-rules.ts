import type { AuthRule } from "../config/resolved-field";
import { isPhoneValue } from "../model/phone-field-value";

// A number without its country is ambiguous (+1 alone is a dozen countries),
// so it is an error even in an optional field. An empty field is left to the
// required rule.
export const phoneCountryRule =
  (message: string): AuthRule =>
  (value) => {
    if (!isPhoneValue(value) || value.number.trim() === "") return undefined;
    return value.country ? undefined : message;
  };
