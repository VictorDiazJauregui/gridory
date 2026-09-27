import type { AuthShellView } from "../model/auth-shell-view";
import type { ResolvedAuthField } from "../config/resolved-field";
import { AuthPasswordControl } from "../password/AuthPasswordControl";
import { AuthPhoneControl } from "./AuthPhoneControl";
import { AuthSelectControl } from "./AuthSelectControl";
import { AuthTextControl } from "./AuthTextControl";

interface AuthFieldControlProps {
  field: ResolvedAuthField;
  shell: AuthShellView;
}

export const AuthFieldControl = ({ field, shell }: AuthFieldControlProps) => {
  if (field.type === "password") return <AuthPasswordControl field={field} shell={shell} />;
  if (field.type === "select") return <AuthSelectControl field={field} shell={shell} />;
  if (field.type === "tel") return <AuthPhoneControl field={field} shell={shell} />;
  return <AuthTextControl field={field} shell={shell} />;
};
