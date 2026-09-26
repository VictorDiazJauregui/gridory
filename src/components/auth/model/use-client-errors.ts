import { useState } from "react";
import type { AuthFieldErrors, AuthFormValues } from "../types";
import { validateField, validateFields } from "../validation/validate-fields";
import type { ResolvedAuthField } from "../config/resolved-field";

const withFieldError = (
  errors: AuthFieldErrors,
  name: string,
  message: string | undefined,
): AuthFieldErrors => {
  const nextErrors = { ...errors };
  delete nextErrors[name];
  return message ? { ...nextErrors, [name]: message } : nextErrors;
};

/**
 * Errors appear when an edited field loses the focus or on submit, and only the
 * fields already showing one are revalidated while typing: the form never
 * scolds a field mid-edit, nor one the user merely tabbed through.
 */
export const useClientErrors = () => {
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [revealed, setRevealed] = useState(false);
  const validateOne = (field: ResolvedAuthField, values: AuthFormValues) =>
    setErrors((current) => withFieldError(current, field.name, validateField(field, values)));
  const revalidateShown = (fields: ResolvedAuthField[], values: AuthFormValues) =>
    setErrors((current) =>
      validateFields(fields.filter((field) => field.name in current), values),
    );
  const showErrors = (nextErrors: AuthFieldErrors) => {
    setErrors(nextErrors);
    setRevealed(true);
  };
  return { errors, revealed, validateOne, revalidateShown, showErrors };
};
