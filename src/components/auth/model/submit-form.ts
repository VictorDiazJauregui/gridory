import { flushSync } from "react-dom";
import type { FormEvent } from "react";
import type { AuthFieldErrors, AuthFormValues, AuthStandardSchema } from "../types";
import { validateWithSchema } from "../validation/standard-schema";
import { hasErrors, validateFields } from "../validation/validate-fields";
import { normalizeValues } from "./form-values";
import type { ResolvedAuthField } from "../config/resolved-field";

export interface SubmitContext {
  fields: ResolvedAuthField[];
  values: AuthFormValues;
  schema?: AuthStandardSchema;
  idFor: (name: string) => string;
  showErrors: (errors: AuthFieldErrors) => void;
  onSubmit: (values: AuthFormValues) => void;
}

// Centered instead of the browser's default edge scroll, so the field's label
// stays visible above it.
const focusFirstInvalid = (form: HTMLFormElement, context: SubmitContext, errors: AuthFieldErrors) => {
  const firstInvalid = context.fields.find((field) => field.name in errors);
  if (!firstInvalid) return;
  const control = form.ownerDocument.getElementById(context.idFor(firstInvalid.name));
  control?.focus({ preventScroll: true });
  control?.scrollIntoView({ block: "center" });
};

// flushSync renders the messages before the focus moves, so a screen reader
// announces the field together with its error.
const rejectSubmit = (form: HTMLFormElement, context: SubmitContext, errors: AuthFieldErrors) => {
  flushSync(() => context.showErrors(errors));
  focusFirstInvalid(form, context, errors);
};

export const submitForm = async (form: HTMLFormElement, context: SubmitContext) => {
  const ruleErrors = validateFields(context.fields, context.values);
  if (hasErrors(ruleErrors)) return rejectSubmit(form, context, ruleErrors);
  if (context.schema) {
    const schemaErrors = await validateWithSchema(context.schema, context.values);
    if (hasErrors(schemaErrors)) return rejectSubmit(form, context, schemaErrors);
  }
  context.onSubmit(normalizeValues(context.fields, context.values));
};

export const createSubmitHandler =
  (context: SubmitContext, submitting: boolean | undefined) =>
  (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    void submitForm(event.currentTarget, context);
  };
