import { cn } from "../../../lib/cn";
import type { AuthShellView } from "../model/auth-shell-view";
import type { ResolvedAuthField } from "../config/resolved-field";
import { textControlProps } from "./field-attributes";

interface AuthTextControlProps {
  field: ResolvedAuthField;
  shell: AuthShellView;
}

export const AuthTextControl = ({ field, shell }: AuthTextControlProps) => {
  const inputClassName = shell.display.classNames?.input;
  if (field.type === "textarea") {
    return (
      <textarea
        {...textControlProps(field, shell)}
        rows={3}
        className={cn("gdy-auth-input gdy-auth-textarea", inputClassName)}
      />
    );
  }
  return (
    <input
      {...textControlProps(field, shell)}
      type={field.type}
      className={cn("gdy-auth-input", inputClassName)}
    />
  );
};
