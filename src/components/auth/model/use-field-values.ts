import { useState } from "react";
import type { AuthFieldValue, AuthFormValues } from "../types";
import { createInitialValues } from "./form-values";
import type { ResolvedAuthField } from "../config/resolved-field";

export interface FieldValuesOptions {
  defaultValues?: AuthFormValues;
  onValuesChange?: (values: AuthFormValues) => void;
}

export const useFieldValues = (
  fields: ResolvedAuthField[],
  options: FieldValuesOptions,
) => {
  const [values, setValues] = useState(() =>
    createInitialValues(fields, options.defaultValues),
  );
  const [editedNames, setEditedNames] = useState<ReadonlySet<string>>(new Set());
  const changeValue = (name: string, value: AuthFieldValue): AuthFormValues => {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setEditedNames((current) => new Set(current).add(name));
    options.onValuesChange?.(nextValues);
    return nextValues;
  };
  return { values, changeValue, wasEdited: (name: string) => editedNames.has(name) };
};
