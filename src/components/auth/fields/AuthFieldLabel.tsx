import { cn } from "../../../lib/cn";
import type { AuthShellView } from "../model/auth-shell-view";
import type { ResolvedAuthField } from "../config/resolved-field";

interface AuthFieldLabelProps {
  field: ResolvedAuthField;
  shell: AuthShellView;
}

export const AuthRequiredMark = () => (
  <span className="gdy-auth-required" aria-hidden="true">
    *
  </span>
);

export const AuthFieldLabel = ({ field, shell }: AuthFieldLabelProps) => (
  <label
    htmlFor={shell.form.idFor(field.name)}
    className={cn("gdy-auth-label", shell.display.classNames?.label)}
  >
    {field.label}
    {field.required && <AuthRequiredMark />}
  </label>
);
