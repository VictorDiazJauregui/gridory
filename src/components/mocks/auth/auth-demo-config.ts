export type AuthDemoForm = "login" | "signup";
export type AuthDemoExample = "basic" | "complete" | "custom";

export interface AuthDemoEvent {
  id: number;
  type: string;
  payload?: unknown;
}

export interface DemoOption<TValue extends string> {
  value: TValue;
  label: string;
}

export const FORM_OPTIONS: DemoOption<AuthDemoForm>[] = [
  { value: "login", label: "Iniciar sesión" },
  { value: "signup", label: "Registro" },
];

export const EXAMPLE_OPTIONS: DemoOption<AuthDemoExample>[] = [
  { value: "basic", label: "Básico" },
  { value: "complete", label: "Completo" },
  { value: "custom", label: "Personalizado" },
];

export const TAKEN_EMAIL = "tomado@empresa.com";
export const SUBMIT_DELAY_MS = 900;

// Written in full so Tailwind's scanner finds every arbitrary property.
export const CUSTOM_THEME_CLASS_NAME = [
  "[--gdy-auth-radius:16px] [--gdy-auth-padding:28px]",
  "[--gdy-auth-submit-bg:#1d4ed8] [--gdy-auth-submit-hover-bg:#1a44c2] [--gdy-auth-submit-fg:#ffffff]",
  "[--gdy-auth-input-focus-border:#1d4ed8] [--gdy-auth-link:#1d4ed8] [--gdy-auth-rule-met:#15803d]",
  "[--gdy-auth-google-hover-bg:#eff6ff] [--gdy-auth-google-hover-border:#93c5fd] [--gdy-auth-google-hover-fg:#1d4ed8]",
  "dark:[--gdy-auth-submit-bg:#3b82f6] dark:[--gdy-auth-submit-hover-bg:#2563eb]",
  "dark:[--gdy-auth-input-focus-border:#60a5fa] dark:[--gdy-auth-link:#60a5fa] dark:[--gdy-auth-rule-met:#4ade80]",
  "dark:[--gdy-auth-google-hover-bg:#1e293b] dark:[--gdy-auth-google-hover-border:#3b82f6] dark:[--gdy-auth-google-hover-fg:#60a5fa]",
].join(" ");
