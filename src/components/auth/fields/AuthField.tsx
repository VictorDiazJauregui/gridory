import { cn } from "../../../lib/cn";
import type { AuthShellView } from "../model/auth-shell-view";
import type { ResolvedAuthField } from "../config/resolved-field";
import { AuthCheckboxField } from "./AuthCheckboxField";
import { AuthFieldControl } from "./AuthFieldControl";
import { AuthFieldError } from "./AuthFieldError";
import { AuthFieldLabel } from "./AuthFieldLabel";
import { AuthPasswordAddon } from "../password/AuthPasswordAddon";

interface AuthFieldProps {
  field: ResolvedAuthField;
  shell: AuthShellView;
}

export const AuthField = ({ field, shell }: AuthFieldProps) => {
  if (field.type === "checkbox") return <AuthCheckboxField field={field} shell={shell} />;
  const addon = field.name === "password" ? shell.passwordAddon : undefined;
  return (
    <div className={cn("gdy-auth-field", shell.display.classNames?.field)}>
      <AuthFieldLabel field={field} shell={shell} />
      <AuthFieldControl field={field} shell={shell} />
      <AuthFieldError field={field} shell={shell} />
      {addon && <AuthPasswordAddon addon={addon} shell={shell} />}
    </div>
  );
};
