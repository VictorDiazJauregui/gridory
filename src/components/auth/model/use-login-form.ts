import type { MouseEvent } from "react";
import { DEFAULT_LOGIN_TEXTS } from "../constants";
import type { AuthFormValues, LoginFormProps, LoginFormValues } from "../types";
import { pickDisplayProps, toLinkView } from "./auth-shell-view";
import type { AuthShellView } from "./auth-shell-view";
import { resolveLoginFields } from "../config/login-fields";
import { useAuthForm } from "./use-auth-form";

type LoginTexts = typeof DEFAULT_LOGIN_TEXTS;
type LoginLinks = Pick<AuthShellView, "passwordAddon" | "footer">;

const resolveLoginLinks = (
  props: LoginFormProps,
  texts: LoginTexts,
  values: AuthFormValues,
): LoginLinks => {
  const { forgotPassword, signUpLink } = props;
  const forgotLink = forgotPassword && {
    label: texts.forgotPassword,
    href: forgotPassword.href,
    onClick: (event: MouseEvent<HTMLElement>) =>
      forgotPassword.onClick?.({ event, email: String(values.email ?? "") }),
  };
  return {
    passwordAddon: forgotLink && { kind: "forgot", link: forgotLink },
    footer: signUpLink && { prompt: texts.signUpPrompt, link: toLinkView(signUpLink, texts.signUpLink) },
  };
};

export const useLoginForm = (props: LoginFormProps): AuthShellView => {
  const texts = { ...DEFAULT_LOGIN_TEXTS, ...props.texts };
  const fields = resolveLoginFields(props, texts);
  const form = useAuthForm(fields, {
    ...props,
    onSubmit: (values) => props.onSubmit(values as LoginFormValues),
  });
  return {
    kind: "login",
    texts,
    fields,
    form,
    display: pickDisplayProps(props),
    ...resolveLoginLinks(props, texts, form.values),
  };
};
