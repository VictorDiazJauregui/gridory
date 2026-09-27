import { cn } from "../../../lib/cn";
import type { AuthShellView } from "../model/auth-shell-view";
import type { ResolvedAuthField } from "../config/resolved-field";
import { errorIdFor } from "./field-attributes";

interface AuthFieldErrorProps {
  field: ResolvedAuthField;
  shell: AuthShellView;
}

export const AuthFieldError = ({ field, shell }: AuthFieldErrorProps) => {
  const message = shell.form.errorFor(field.name);
  if (!message) return null;
  return (
    <p
      id={errorIdFor(shell.form.idFor(field.name))}
      className={cn("gdy-auth-error", shell.display.classNames?.error)}
    >
      {message}
    </p>
  );
};
