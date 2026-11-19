import { useState } from "react";
import { EMPTY_PHONE_VALUE } from "../constants";
import type { CountryCode, PhoneInputSettings, PhoneInputValue } from "../types";
import { assertValidMaxNumberLength, limitNumberLength } from "./number-length-limit";
import { splitPastedInternationalNumber, type PastedNumberRules } from "./pasted-international-number";
import { sanitizePhoneNumber } from "./phone-number-rules";

type PhoneValueSettings = Pick<
  PhoneInputSettings,
  "value" | "defaultValue" | "defaultCountry" | "onValueChange" | "numberCharacters" | "maxNumberLength" | "splitPastedDialCode"
>;

interface NumberEditing {
  value: PhoneInputValue;
  commitValue: (nextValue: PhoneInputValue) => void;
  rules: PastedNumberRules;
}

const resolveInitialValue = ({ defaultValue, defaultCountry }: PhoneValueSettings): PhoneInputValue =>
  defaultValue ?? { ...EMPTY_PHONE_VALUE, country: defaultCountry ?? null };

/** Throws InvalidMaxNumberLengthError when the maximum is not a whole number from 1. */
const resolveNumberRules = ({ numberCharacters, maxNumberLength }: PhoneValueSettings): PastedNumberRules => {
  assertValidMaxNumberLength(maxNumberLength);
  return { characters: numberCharacters ?? "phone", maxLength: maxNumberLength };
};

// Controlled with `value`, uncontrolled otherwise. Emits a new object only on a real change: a rejected
// character leaves the number as it was, and React puts the input back.
const useStoredPhoneValue = (settings: PhoneValueSettings) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(() => resolveInitialValue(settings));
  const value = settings.value ?? uncontrolledValue;
  const commitValue = (nextValue: PhoneInputValue) => {
    if (nextValue.country === value.country && nextValue.number === value.number) return;
    if (settings.value === undefined) setUncontrolledValue(nextValue);
    settings.onValueChange?.(nextValue);
  };
  return { value, commitValue };
};

// The starting value is never filtered: the rule and the maximum apply to what is typed or pasted.
const buildNumberEdits = ({ value, commitValue, rules }: NumberEditing) => ({
  changeNumber: (text: string) => {
    const next = sanitizePhoneNumber(text, rules.characters);
    const current = sanitizePhoneNumber(value.number, rules.characters);
    const number = limitNumberLength({ next, current, max: rules.maxLength });
    if (number !== null) commitValue({ ...value, number });
  },
  pasteInternationalNumber: (text: string): boolean => {
    const pastedValue = splitPastedInternationalNumber(text, { country: value.country, rules });
    if (pastedValue) commitValue(pastedValue);
    return pastedValue !== undefined;
  },
});

export const usePhoneValue = (settings: PhoneValueSettings) => {
  const { value, commitValue } = useStoredPhoneValue(settings);
  const edits = buildNumberEdits({ value, commitValue, rules: resolveNumberRules(settings) });
  const changeCountry = (country: CountryCode) => commitValue({ ...value, country });
  // Without splitPastedDialCode a paste never leaves the input: it stays a 2.2.0 paste.
  const pasteWholeNumber = (text: string): boolean => Boolean(settings.splitPastedDialCode) && edits.pasteInternationalNumber(text);
  return { value, changeCountry, changeNumber: edits.changeNumber, pasteWholeNumber };
};
