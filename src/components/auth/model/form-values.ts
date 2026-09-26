import type { AuthFieldValue, AuthFormValues } from "../types";
import type { ResolvedAuthField } from "../config/resolved-field";

const emptyValueFor = (field: ResolvedAuthField): AuthFieldValue =>
  field.type === "checkbox" ? false : "";

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
