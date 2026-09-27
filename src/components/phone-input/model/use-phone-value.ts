import { useState } from "react";
import { EMPTY_PHONE_VALUE } from "../constants";
import type { CountryCode, PhoneInputSettings, PhoneInputValue } from "../types";
import { sanitizePhoneNumber } from "./phone-number-rules";

type PhoneValueSettings = Pick<PhoneInputSettings, "value" | "defaultValue" | "defaultCountry" | "onValueChange">;

const resolveInitialValue = ({ defaultValue, defaultCountry }: PhoneValueSettings): PhoneInputValue =>
  defaultValue ?? { ...EMPTY_PHONE_VALUE, country: defaultCountry ?? null };

/**
 * Controlled with `value`, uncontrolled otherwise. Emits a new object only on
 * a real change: a rejected character leaves the number as it was, and React
 * puts the input back.
 */
export const usePhoneValue = (settings: PhoneValueSettings) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(() => resolveInitialValue(settings));
  const value = settings.value ?? uncontrolledValue;
  const commitValue = (nextValue: PhoneInputValue) => {
    if (settings.value === undefined) setUncontrolledValue(nextValue);
    settings.onValueChange?.(nextValue);
  };
  const changeCountry = (country: CountryCode) => {
    if (country !== value.country) commitValue({ ...value, country });
  };
  const changeNumber = (text: string) => {
    const number = sanitizePhoneNumber(text);
    if (number !== value.number) commitValue({ ...value, number });
  };
  return { value, changeCountry, changeNumber };
};
