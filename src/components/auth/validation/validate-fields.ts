import type { AuthFieldErrors, AuthFormValues } from "../types";
import type { ResolvedAuthField } from "../config/resolved-field";

export const validateField = (
  field: ResolvedAuthField,
  values: AuthFormValues,
): string | undefined => {
  const value = values[field.name] ?? "";
  for (const rule of field.rules) {
    const message = rule(value, values);
    if (message) return message;
  }
  return undefined;
};

export const validateFields = (
  fields: ResolvedAuthField[],
  values: AuthFormValues,
): AuthFieldErrors =>
  Object.fromEntries(
    fields.flatMap((field) => {
      const message = validateField(field, values);
      return message ? [[field.name, message]] : [];
    }),
  );

export const hasErrors = (errors: AuthFieldErrors): boolean =>
  Object.keys(errors).length > 0;
