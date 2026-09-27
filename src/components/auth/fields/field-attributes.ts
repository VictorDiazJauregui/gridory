import type { ChangeEvent } from "react";
import type { AuthShellView } from "../model/auth-shell-view";
import type { ResolvedAuthField } from "../config/resolved-field";

export interface FieldAriaAttributes {
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
  "aria-describedby"?: string;
}

export const errorIdFor = (fieldId: string): string => `${fieldId}-error`;
export const addonIdFor = (fieldId: string): string => `${fieldId}-addon`;

const describesPasswordRules = (field: ResolvedAuthField, shell: AuthShellView): boolean =>
  field.name === "password" && shell.passwordAddon?.kind === "rules";

export const fieldAriaAttributes = (
  field: ResolvedAuthField,
  shell: AuthShellView,
): FieldAriaAttributes => {
  const fieldId = shell.form.idFor(field.name);
  const hasError = Boolean(shell.form.errorFor(field.name));
  const describedBy = [
    hasError && errorIdFor(fieldId),
    describesPasswordRules(field, shell) && addonIdFor(fieldId),
  ].filter(Boolean);
  return {
    "aria-invalid": hasError || undefined,
    "aria-required": field.required || undefined,
    "aria-describedby": describedBy.join(" ") || undefined,
  };
};

export const textValueOf = (field: ResolvedAuthField, shell: AuthShellView): string =>
  String(shell.form.values[field.name] ?? "");

/** Props shared by every typed control: input, textarea and password. */
export const textControlProps = (field: ResolvedAuthField, shell: AuthShellView) => ({
  ...fieldAriaAttributes(field, shell),
  id: shell.form.idFor(field.name),
  name: field.name,
  value: textValueOf(field, shell),
  placeholder: field.placeholder,
  autoComplete: field.autoComplete,
  onBlur: () => shell.form.blurField(field),
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    shell.form.changeField(field, event.target.value),
});
