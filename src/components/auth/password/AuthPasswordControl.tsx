import { useState } from "react";
import { cn } from "../../../lib/cn";
import type { AuthShellView } from "../model/auth-shell-view";
import type { ResolvedAuthField } from "../config/resolved-field";
import { AuthPasswordToggle } from "./AuthPasswordToggle";
import { textControlProps } from "../fields/field-attributes";

interface AuthPasswordControlProps {
  field: ResolvedAuthField;
  shell: AuthShellView;
}

export const AuthPasswordControl = ({ field, shell }: AuthPasswordControlProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="gdy-auth-password">
      <input
        {...textControlProps(field, shell)}
        type={visible ? "text" : "password"}
        className={cn("gdy-auth-input", shell.display.classNames?.input)}
      />
      <AuthPasswordToggle
        visible={visible}
        controls={shell.form.idFor(field.name)}
        texts={shell.texts}
        onToggle={() => setVisible((current) => !current)}
      />
    </div>
  );
};
