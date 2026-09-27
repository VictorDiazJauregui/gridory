import type { AuthFieldValue, AuthFormValues } from "../types";
import type { ResolvedAuthField } from "../config/resolved-field";
import { EMPTY_AUTH_PHONE_VALUE, isPhoneValue } from "./phone-field-value";

const emptyValueFor = (field: ResolvedAuthField): AuthFieldValue => {
  if (field.type === "checkbox") return false;
  return field.type === "tel" ? EMPTY_AUTH_PHONE_VALUE : "";
};

export const createInitialValues = (
  fields: ResolvedAuthField[],
  defaultValues: AuthFormValues | undefined,
): AuthFormValues =>
  Object.fromEntries(
    fields.map((field) => [
      field.name,
      defaultValues?.[field.name] ?? emptyValueFor(field),
    ]),
  );

// Passwords keep their spaces on purpose: they may be part of the secret.
const normalizeValue = (
  field: ResolvedAuthField,
  value: AuthFieldValue,
): AuthFieldValue => {
  if (typeof value === "boolean" || field.type === "password") return value;
  if (isPhoneValue(value)) return { ...value, number: value.number.trim() };
  const trimmed = value.trim();
  return field.type === "email" ? trimmed.toLowerCase() : trimmed;
};

export const normalizeValues = (
  fields: ResolvedAuthField[],
  values: AuthFormValues,
): AuthFormValues =>
  Object.fromEntries(
    fields.map((field) => [
      field.name,
      normalizeValue(field, values[field.name] ?? emptyValueFor(field)),
    ]),
  );
