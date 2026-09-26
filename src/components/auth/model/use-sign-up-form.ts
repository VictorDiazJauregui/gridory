import { DEFAULT_SIGN_UP_TEXTS } from "../constants";
import type { SignUpFormProps, SignUpFormValues } from "../types";
import { buildPasswordRequirements } from "../password/password-rules";
import { pickDisplayProps, toLinkView } from "./auth-shell-view";
import type { AuthShellView } from "./auth-shell-view";
import { resolveSignUpFields } from "../config/sign-up-fields";
import { useAuthForm } from "./use-auth-form";

export const useSignUpForm = (props: SignUpFormProps): AuthShellView => {
  const texts = { ...DEFAULT_SIGN_UP_TEXTS, ...props.texts };
  const requirements = buildPasswordRequirements(props.passwordRules, texts);
  const fields = resolveSignUpFields({ props, texts, requirements });
  const form = useAuthForm(fields, {
    ...props,
    onSubmit: (values) => props.onSubmit(values as SignUpFormValues),
  });
  const { signInLink } = props;
  return {
    kind: "signup",
    texts,
    fields,
    form,
    display: pickDisplayProps(props),
    passwordAddon: requirements.length > 0 ? { kind: "rules", requirements, texts } : undefined,
    footer: signInLink && { prompt: texts.signInPrompt, link: toLinkView(signInLink, texts.signInLink) },
  };
};
