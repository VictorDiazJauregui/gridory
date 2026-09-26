import type { ReactNode } from "react";
import type {
  AuthCommonTexts,
  AuthFieldOption,
  AuthFieldType,
  AuthFieldValidator,
} from "../types";
import { emailRule, requiredRule } from "../validation/field-rules";
import { resolveRequiredMessage } from "./required-message";
import type { RequiredMessageTexts } from "./required-message";
import type { AuthRule, ResolvedAuthField } from "./resolved-field";

export interface AuthFieldSpec {
  name: string;
  label: ReactNode;
  type: AuthFieldType;
  required: boolean;
  placeholder?: string;
  requiredMessage?: string;
  autoComplete?: string;
  options?: AuthFieldOption[];
  validate?: AuthFieldValidator;
  extraRules?: AuthRule[];
}

export type FieldRuleTexts = RequiredMessageTexts &
  Required<Pick<AuthCommonTexts, "invalidEmail">>;

const buildRules = (spec: AuthFieldSpec, texts: FieldRuleTexts): AuthRule[] => [
  ...(spec.required ? [requiredRule(resolveRequiredMessage(spec, texts))] : []),
  ...(spec.type === "email" ? [emailRule(texts.invalidEmail)] : []),
  ...(spec.extraRules ?? []),
  ...(spec.validate ? [spec.validate] : []),
];

export const resolveField = (
  spec: AuthFieldSpec,
  texts: FieldRuleTexts,
): ResolvedAuthField => ({
  name: spec.name,
  label: spec.label,
  type: spec.type,
  required: spec.required,
  placeholder: spec.placeholder,
  autoComplete: spec.autoComplete,
  options: spec.options,
  rules: buildRules(spec, texts),
});
