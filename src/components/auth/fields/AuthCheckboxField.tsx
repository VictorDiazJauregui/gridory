import { cn } from "../../../lib/cn";
import type { AuthShellView } from "../model/auth-shell-view";
import type { ResolvedAuthField } from "../config/resolved-field";
import { AuthFieldError } from "./AuthFieldError";
import { AuthRequiredMark } from "./AuthFieldLabel";
import { fieldAriaAttributes } from "./field-attributes";

interface AuthCheckboxFieldProps {
  field: ResolvedAuthField;
  shell: AuthShellView;
}

const AuthCheckboxInput = ({ field, shell }: AuthCheckboxFieldProps) => (
  <input
    {...fieldAriaAttributes(field, shell)}
    id={shell.form.idFor(field.name)}
    name={field.name}
    type="checkbox"
    className="gdy-auth-checkbox-input"
    checked={Boolean(shell.form.values[field.name])}
    onChange={(event) => shell.form.changeField(field, event.target.checked)}
  />
);

export const AuthCheckboxField = ({ field, shell }: AuthCheckboxFieldProps) => {
  const { classNames } = shell.display;
  return (
    <div className={cn("gdy-auth-field", classNames?.field)}>
      <div className="gdy-auth-checkbox">
        <AuthCheckboxInput field={field} shell={shell} />
        <label htmlFor={shell.form.idFor(field.name)} className={cn("gdy-auth-checkbox-label", classNames?.label)}>
          {field.label}
          {field.required && <AuthRequiredMark />}
        </label>
      </div>
      <AuthFieldError field={field} shell={shell} />
    </div>
  );
};
