import { AuthShell } from "./layout/AuthShell";
import { useSignUpForm } from "./model/use-sign-up-form";
import type { SignUpFormProps } from "./types";
import "./styles.css";

export const SignUpForm = (props: SignUpFormProps) => {
  const shell = useSignUpForm(props);
  return <AuthShell shell={shell} />;
};
