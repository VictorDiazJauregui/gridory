import { DEFAULT_LOGIN_FIELDS } from "../constants";
import type { LoginFormProps } from "../types";
import { builtInSpec, finalizeFields } from "./built-in-fields";
import type { BuiltInFieldBase } from "./built-in-fields";
import type { FieldRuleTexts } from "./resolve-field";
import type { ResolvedAuthField } from "./resolved-field";

const EMAIL_BASE: BuiltInFieldBase = {
  name: "email",
  type: "email",
  autoComplete: "email",
  required: true,
};

const PASSWORD_BASE: BuiltInFieldBase = {
  name: "password",
  type: "password",
  autoComplete: "current-password",
  required: true,
};

export const resolveLoginFields = (
  props: Pick<LoginFormProps, "fields" | "extraFields" | "fieldOrder">,
  texts: FieldRuleTexts,
): ResolvedAuthField[] => {
  const builtIn = [
    builtInSpec(EMAIL_BASE, { ...DEFAULT_LOGIN_FIELDS.email, ...props.fields?.email }),
    builtInSpec(PASSWORD_BASE, { ...DEFAULT_LOGIN_FIELDS.password, ...props.fields?.password }),
  ];
  return finalizeFields(
    { builtIn, extraFields: props.extraFields, fieldOrder: props.fieldOrder },
    texts,
  );
};
