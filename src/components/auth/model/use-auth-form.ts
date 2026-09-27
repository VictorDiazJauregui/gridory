import { useId } from "react";
import type { FormEvent } from "react";
import type {
  AuthFieldErrors,
  AuthFieldValue,
  AuthFormValues,
  AuthStandardSchema,
} from "../types";
import { createSubmitHandler } from "./submit-form";
import type { ResolvedAuthField } from "../config/resolved-field";
import { useClientErrors } from "./use-client-errors";
import { useFieldValues } from "./use-field-values";
import type { FieldValuesOptions } from "./use-field-values";
import { useServerErrors } from "./use-server-errors";

export interface AuthFormOptions extends FieldValuesOptions {
  fieldErrors?: AuthFieldErrors;
  schema?: AuthStandardSchema;
  submitting?: boolean;
  onSubmit: (values: AuthFormValues) => void;
}

export interface AuthFormController {
  values: AuthFormValues;
  revealed: boolean;
  idFor: (name: string) => string;
  errorFor: (name: string) => string | undefined;
  changeField: (field: ResolvedAuthField, value: AuthFieldValue) => void;
  blurField: (field: ResolvedAuthField) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const useAuthFormState = (fields: ResolvedAuthField[], options: AuthFormOptions) => {
  const { values, changeValue, wasEdited } = useFieldValues(fields, options);
  const client = useClientErrors();
  const server = useServerErrors(options.fieldErrors);
  const changeField = (field: ResolvedAuthField, value: AuthFieldValue) => {
    client.revalidateShown(fields, changeValue(field.name, value));
    server.dismissServerError(field.name);
  };
  const blurField = (field: ResolvedAuthField) => {
    if (wasEdited(field.name)) client.validateOne(field, values);
  };
  return { values, client, server, changeField, blurField };
};

export const useAuthForm = (
  fields: ResolvedAuthField[],
  options: AuthFormOptions,
): AuthFormController => {
  const formId = useId();
  const idFor = (name: string) => `${formId}-${name}`;
  const { values, client, server, changeField, blurField } = useAuthFormState(fields, options);
  const submitContext = { ...options, fields, values, idFor, showErrors: client.showErrors };
  return {
    values,
    revealed: client.revealed,
    idFor,
    errorFor: (name) => client.errors[name] ?? server.serverErrorFor(name),
    changeField,
    blurField,
    handleSubmit: createSubmitHandler(submitContext, options.submitting),
  };
};
