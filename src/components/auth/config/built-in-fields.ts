import type { AuthExtraField, AuthFieldConfig, AuthFieldType } from "../types";
import { applyFieldOrder, assertUniqueFieldNames } from "./field-order";
import { resolveField } from "./resolve-field";
import type { AuthFieldSpec, FieldRuleTexts } from "./resolve-field";
import type { AuthRule, ResolvedAuthField } from "./resolved-field";

export interface BuiltInFieldBase {
  name: string;
  type: AuthFieldType;
  autoComplete: string;
  required?: boolean;
  extraRules?: AuthRule[];
}

export const builtInSpec = (
  base: BuiltInFieldBase,
  config: AuthFieldConfig,
): AuthFieldSpec => ({
  label: config.label,
  placeholder: config.placeholder,
  requiredMessage: config.requiredMessage,
  validate: config.validate,
  ...base,
  required: base.required ?? config.required ?? false,
});

export const optionalBuiltInSpec = (
  base: BuiltInFieldBase,
  config: AuthFieldConfig | false | undefined,
  defaults: AuthFieldConfig,
): AuthFieldSpec[] =>
  config === false ? [] : [builtInSpec(base, { ...defaults, ...config })];

const toExtraFieldSpec = (field: AuthExtraField): AuthFieldSpec => ({
  ...field,
  type: field.type ?? "text",
  required: field.required ?? false,
});

export interface FieldListSource {
  builtIn: AuthFieldSpec[];
  extraFields?: AuthExtraField[];
  fieldOrder?: string[];
}

export const finalizeFields = (
  source: FieldListSource,
  texts: FieldRuleTexts,
): ResolvedAuthField[] => {
  const specs = [
    ...source.builtIn,
    ...(source.extraFields ?? []).map(toExtraFieldSpec),
  ];
  const fields = specs.map((spec) => resolveField(spec, texts));
  assertUniqueFieldNames(fields);
  return applyFieldOrder(fields, source.fieldOrder);
};
