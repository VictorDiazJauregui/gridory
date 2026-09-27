import { DEFAULT_SIGN_UP_FIELDS } from "../constants";
import type { SignUpFieldsConfig, SignUpFormProps, SignUpFormTexts } from "../types";
import { matchRule } from "../validation/field-rules";
import { passwordRequirementsRule } from "../password/password-rules";
import type { PasswordRequirement } from "../password/password-rules";
import { builtInSpec, finalizeFields, optionalBuiltInSpec } from "./built-in-fields";
import type { AuthFieldSpec, FieldRuleTexts } from "./resolve-field";
import type { ResolvedAuthField } from "./resolved-field";

export type SignUpFieldTexts = FieldRuleTexts &
  Required<Pick<SignUpFormTexts, "passwordMismatch" | "passwordRequirements">>;

export interface SignUpFieldsSource {
  props: Pick<SignUpFormProps, "fields" | "extraFields" | "fieldOrder">;
  texts: SignUpFieldTexts;
  requirements: PasswordRequirement[];
}

const nameSpecs = (config: SignUpFieldsConfig): AuthFieldSpec[] => [
  ...optionalBuiltInSpec(
    { name: "firstName", type: "text", autoComplete: "given-name" },
    config.firstName,
    DEFAULT_SIGN_UP_FIELDS.firstName,
  ),
  ...optionalBuiltInSpec(
    { name: "lastName", type: "text", autoComplete: "family-name" },
    config.lastName,
    DEFAULT_SIGN_UP_FIELDS.lastName,
  ),
];

const credentialSpecs = ({ props, texts, requirements }: SignUpFieldsSource): AuthFieldSpec[] => [
  builtInSpec(
    { name: "email", type: "email", autoComplete: "email", required: true },
    { ...DEFAULT_SIGN_UP_FIELDS.email, ...props.fields?.email },
  ),
  builtInSpec(
    {
      name: "password",
      type: "password",
      autoComplete: "new-password",
      required: true,
      extraRules: [passwordRequirementsRule(requirements, texts.passwordRequirements)],
    },
    { ...DEFAULT_SIGN_UP_FIELDS.password, ...props.fields?.password },
  ),
];

const confirmPasswordSpecs = (config: SignUpFieldsConfig, texts: SignUpFieldTexts): AuthFieldSpec[] =>
  optionalBuiltInSpec(
    {
      name: "confirmPassword",
      type: "password",
      autoComplete: "new-password",
      required: true,
      extraRules: [matchRule("password", texts.passwordMismatch)],
    },
    config.confirmPassword,
    DEFAULT_SIGN_UP_FIELDS.confirmPassword,
  );

export const resolveSignUpFields = (source: SignUpFieldsSource): ResolvedAuthField[] => {
  const { props, texts } = source;
  const config = props.fields ?? {};
  const builtIn = [
    ...nameSpecs(config),
    ...credentialSpecs(source),
    ...confirmPasswordSpecs(config, texts),
  ];
  return finalizeFields(
    { builtIn, extraFields: props.extraFields, fieldOrder: props.fieldOrder },
    texts,
  );
};
