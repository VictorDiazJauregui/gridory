import { AuthShell } from "./layout/AuthShell";
import { useLoginForm } from "./model/use-login-form";
import type { LoginFormProps } from "./types";
import "./styles.css";

export const LoginForm = (props: LoginFormProps) => {
  const shell = useLoginForm(props);
  return <AuthShell shell={shell} />;
};
