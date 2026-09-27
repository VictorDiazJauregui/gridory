import { cn } from "../../../lib/cn";
import type { FieldControlAttributes } from "../../shared/field/field-props";
import { PhoneInputControl } from "../../phone-input/parts/PhoneInputControl";
import type { AuthShellView } from "../model/auth-shell-view";
import { toPhoneValue } from "../model/phone-field-value";
import type { ResolvedAuthField } from "../config/resolved-field";
import { fieldAriaAttributes } from "./field-attributes";

interface AuthPhoneControlProps {
  field: ResolvedAuthField;
  shell: AuthShellView;
}

const buildPhoneControl = (field: ResolvedAuthField, shell: AuthShellView): FieldControlAttributes => {
  const aria = fieldAriaAttributes(field, shell);
  return {
    id: shell.form.idFor(field.name),
    "aria-describedby": aria["aria-describedby"],
    "aria-invalid": aria["aria-invalid"] || undefined,
    "aria-required": aria["aria-required"] || undefined,
  };
};

// Only the prefix and the number: the form keeps its own label and error, so
// the phone reads like the fields around it.
export const AuthPhoneControl = ({ field, shell }: AuthPhoneControlProps) => (
  <PhoneInputControl
    settings={{
      value: toPhoneValue(shell.form.values[field.name]),
      onValueChange: (value) => shell.form.changeField(field, value),
      placeholder: field.placeholder,
      className: cn("gdy-auth-phone", shell.display.classNames?.input),
    }}
    control={buildPhoneControl(field, shell)}
    name={field.name}
    onBlur={() => shell.form.blurField(field)}
  />
);
