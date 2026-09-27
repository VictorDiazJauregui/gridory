import type { MouseEvent } from "react";
import type {
  AuthCommonTexts,
  AuthFormKind,
  AuthLinkConfig,
  LoginFormProps,
  SignUpFormTexts,
} from "../types";
import type { PasswordRequirement } from "../password/password-rules";
import type { ResolvedAuthField } from "../config/resolved-field";
import type { AuthFormController } from "./use-auth-form";

export type AuthShellTexts = Required<
  Pick<
    AuthCommonTexts,
    "title" | "submit" | "submitting" | "google" | "divider" | "showPassword" | "hidePassword"
  >
> &
  Pick<AuthCommonTexts, "subtitle">;

export type AuthDisplayProps = Pick<
  LoginFormProps,
  "google" | "submitting" | "error" | "titleAs" | "width" | "className" | "classNames"
>;

export interface AuthLinkView {
  label: string;
  href?: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}

export interface AuthFooterView {
  prompt: string;
  link: AuthLinkView;
}

export type PasswordRulesTexts = Required<
  Pick<SignUpFormTexts, "passwordRulesTitle" | "ruleMet" | "ruleUnmet">
>;

export type AuthPasswordAddonView =
  | { kind: "forgot"; link: AuthLinkView }
  | { kind: "rules"; requirements: PasswordRequirement[]; texts: PasswordRulesTexts };

export interface AuthShellView {
  kind: AuthFormKind;
  texts: AuthShellTexts;
  fields: ResolvedAuthField[];
  form: AuthFormController;
  display: AuthDisplayProps;
  passwordAddon?: AuthPasswordAddonView;
  footer?: AuthFooterView;
}

export const pickDisplayProps = (props: AuthDisplayProps): AuthDisplayProps => ({
  google: props.google,
  submitting: props.submitting,
  error: props.error,
  titleAs: props.titleAs,
  width: props.width,
  className: props.className,
  classNames: props.classNames,
});

export const toLinkView = (config: AuthLinkConfig, label: string): AuthLinkView => ({
  label,
  href: config.href,
  onClick: (event) => config.onClick?.({ event }),
});
