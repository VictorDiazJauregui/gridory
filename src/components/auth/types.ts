import type { MouseEvent, ReactNode } from "react";

export type AuthFieldValue = string | boolean;
export type AuthFormValues = Record<string, AuthFieldValue>;
export type AuthFieldErrors = Record<string, string>;

export type AuthExtraFieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "textarea"
  | "select"
  | "checkbox";

export type AuthFieldType = AuthExtraFieldType | "password";

export type AuthHeadingLevel = "h1" | "h2" | "h3" | "h4";

export type AuthFormKind = "login" | "signup";

export interface AuthFieldOption {
  value: string;
  label: string;
}

export type AuthFieldValidator = (
  value: AuthFieldValue,
  values: AuthFormValues,
) => string | undefined;

/** Overrides for a built-in field (email, password, name fields). */
export interface AuthFieldConfig {
  label?: ReactNode;
  placeholder?: string;
  /** Only the name fields honor it: email and password are always required. */
  required?: boolean;
  requiredMessage?: string;
  validate?: AuthFieldValidator;
}

export interface AuthExtraField {
  name: string;
  label: ReactNode;
  type?: AuthExtraFieldType;
  required?: boolean;
  placeholder?: string;
  requiredMessage?: string;
  autoComplete?: string;
  options?: AuthFieldOption[];
  validate?: AuthFieldValidator;
}

export interface LoginFieldsConfig {
  email?: AuthFieldConfig;
  password?: AuthFieldConfig;
}

/** `false` hides an optional built-in field. */
export interface SignUpFieldsConfig {
  firstName?: AuthFieldConfig | false;
  lastName?: AuthFieldConfig | false;
  email?: AuthFieldConfig;
  password?: AuthFieldConfig;
  confirmPassword?: AuthFieldConfig | false;
}

export interface AuthPasswordPattern {
  pattern: RegExp;
  label: string;
}

export interface AuthPasswordRules {
  minLength?: number;
  maxLength?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  number?: boolean;
  symbol?: boolean;
  patterns?: AuthPasswordPattern[];
}

export type AuthPasswordRuleStatus = "pending" | "met" | "unmet";

export interface AuthLinkEvent {
  event: MouseEvent<HTMLElement>;
}

export interface AuthForgotPasswordEvent extends AuthLinkEvent {
  email: string;
}

/** Rendered as an `<a>` when `href` is set, as a `<button>` otherwise. */
export interface AuthLinkConfig<TEvent extends AuthLinkEvent = AuthLinkEvent> {
  href?: string;
  onClick?: (payload: TEvent) => void;
}

export interface AuthGoogleConfig {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Mounted over the button, e.g. Google's official button kept invisible. */
  render?: () => ReactNode;
  disabled?: boolean;
}

export interface AuthSchemaIssue {
  readonly message: string;
  readonly path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }>;
}

export type AuthSchemaResult =
  | { readonly value: unknown; readonly issues?: undefined }
  | { readonly issues: ReadonlyArray<AuthSchemaIssue> };

/** Any Standard Schema validator (zod 3.24+, valibot, arktype…). */
export interface AuthStandardSchema {
  readonly "~standard": {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (
      value: unknown,
    ) => AuthSchemaResult | Promise<AuthSchemaResult>;
  };
}

export interface AuthCommonTexts {
  title?: string;
  subtitle?: string;
  submit?: string;
  submitting?: string;
  google?: string;
  divider?: string;
  showPassword?: string;
  hidePassword?: string;
  /** `{label}` is replaced by the field label. */
  requiredMessage?: string;
  requiredFallback?: string;
  invalidEmail?: string;
  checkboxRequired?: string;
  selectRequired?: string;
}

export interface LoginFormTexts extends AuthCommonTexts {
  forgotPassword?: string;
  signUpPrompt?: string;
  signUpLink?: string;
}

export interface SignUpFormTexts extends AuthCommonTexts {
  signInPrompt?: string;
  signInLink?: string;
  passwordMismatch?: string;
  passwordRequirements?: string;
  passwordRulesTitle?: string;
  /** `{count}` is replaced by the configured length. */
  ruleMinLength?: string;
  ruleMaxLength?: string;
  ruleUppercase?: string;
  ruleLowercase?: string;
  ruleNumber?: string;
  ruleSymbol?: string;
  ruleMet?: string;
  ruleUnmet?: string;
}

export interface AuthFormClassNames {
  root?: string;
  title?: string;
  subtitle?: string;
  form?: string;
  field?: string;
  label?: string;
  input?: string;
  error?: string;
  alert?: string;
  submit?: string;
  divider?: string;
  google?: string;
  footer?: string;
  link?: string;
  passwordRules?: string;
}

interface AuthFormBaseProps<TTexts, TFields, TValues> {
  onSubmit: (values: TValues) => void;
  onValuesChange?: (values: AuthFormValues) => void;
  defaultValues?: AuthFormValues;
  fields?: TFields;
  extraFields?: AuthExtraField[];
  fieldOrder?: string[];
  schema?: AuthStandardSchema;
  submitting?: boolean;
  error?: ReactNode;
  fieldErrors?: AuthFieldErrors;
  google?: AuthGoogleConfig;
  texts?: TTexts;
  titleAs?: AuthHeadingLevel;
  width?: number | string;
  className?: string;
  classNames?: AuthFormClassNames;
}

export type LoginFormValues = AuthFormValues & {
  email: string;
  password: string;
};

export type SignUpFormValues = AuthFormValues & {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
};

export interface LoginFormProps extends AuthFormBaseProps<
  LoginFormTexts,
  LoginFieldsConfig,
  LoginFormValues
> {
  forgotPassword?: AuthLinkConfig<AuthForgotPasswordEvent>;
  signUpLink?: AuthLinkConfig;
}

export interface SignUpFormProps extends AuthFormBaseProps<
  SignUpFormTexts,
  SignUpFieldsConfig,
  SignUpFormValues
> {
  passwordRules?: AuthPasswordRules;
  signInLink?: AuthLinkConfig;
}
