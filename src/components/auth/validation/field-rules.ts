import type { AuthFieldValue } from "../types";
import type { AuthRule } from "../config/resolved-field";
import { isPhoneValue } from "../model/phone-field-value";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

export const isEmptyValue = (value: AuthFieldValue | undefined): boolean => {
  if (typeof value === "boolean") return !value;
  if (isPhoneValue(value)) return value.number.trim() === "";
  return (value ?? "").trim() === "";
};

export const requiredRule =
  (message: string): AuthRule =>
  (value) =>
    isEmptyValue(value) ? message : undefined;

export const emailRule =
  (message: string): AuthRule =>
  (value) => {
    if (isEmptyValue(value)) return undefined;
    return EMAIL_PATTERN.test(String(value).trim()) ? undefined : message;
  };

export const matchRule =
  (otherFieldName: string, message: string): AuthRule =>
  (value, values) => {
    if (isEmptyValue(value)) return undefined;
    return value === values[otherFieldName] ? undefined : message;
  };
