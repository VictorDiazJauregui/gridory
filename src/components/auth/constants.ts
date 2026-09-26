import type {
  AuthCommonTexts,
  AuthFieldConfig,
  LoginFormTexts,
  SignUpFormTexts,
} from "./types";

type RequiredTexts<TTexts> = Required<Omit<TTexts, "subtitle">>;

const COMMON_TEXTS: RequiredTexts<
  Omit<AuthCommonTexts, "title" | "submit" | "submitting">
> = {
  google: "Continuar con Google",
  divider: "o",
  showPassword: "Mostrar contraseña",
  hidePassword: "Ocultar contraseña",
  requiredMessage: "Ingresa tu {label}",
  requiredFallback: "Este campo es obligatorio",
  invalidEmail: "Ingresa un email válido",
  checkboxRequired: "Debes marcar esta casilla para continuar",
  selectRequired: "Selecciona una opción",
};

export const DEFAULT_LOGIN_TEXTS: RequiredTexts<LoginFormTexts> = {
  ...COMMON_TEXTS,
  title: "Iniciar sesión",
  submit: "Iniciar sesión",
  submitting: "Iniciando sesión...",
  forgotPassword: "¿Olvidaste tu contraseña?",
  signUpPrompt: "¿No tienes cuenta?",
  signUpLink: "Regístrate aquí",
};

export const DEFAULT_SIGN_UP_TEXTS: RequiredTexts<SignUpFormTexts> = {
  ...COMMON_TEXTS,
  title: "Crea tu cuenta",
  submit: "Siguiente",
  submitting: "Validando...",
  signInPrompt: "¿Ya tienes una cuenta?",
  signInLink: "Inicia sesión",
  passwordMismatch: "Las contraseñas no coinciden",
  passwordRequirements: "La contraseña no cumple todos los requisitos",
  passwordRulesTitle: "La contraseña debe tener:",
  ruleMinLength: "Al menos {count} caracteres",
  ruleMaxLength: "Como máximo {count} caracteres",
  ruleUppercase: "Una letra mayúscula",
  ruleLowercase: "Una letra minúscula",
  ruleNumber: "Un número",
  ruleSymbol: "Un carácter especial",
  ruleMet: "Cumplido",
  ruleUnmet: "Pendiente",
};

const EMAIL_FIELD: AuthFieldConfig = {
  label: "Email",
  placeholder: "tu@email.com",
};
const PASSWORD_FIELD: AuthFieldConfig = {
  label: "Contraseña",
  placeholder: "••••••••",
};

export const DEFAULT_LOGIN_FIELDS = {
  email: EMAIL_FIELD,
  password: PASSWORD_FIELD,
} satisfies Record<string, AuthFieldConfig>;

export const DEFAULT_SIGN_UP_FIELDS = {
  firstName: { label: "Nombre", placeholder: "Tu nombre" },
  lastName: { label: "Apellido", placeholder: "Tu apellido" },
  email: EMAIL_FIELD,
  password: PASSWORD_FIELD,
  confirmPassword: {
    label: "Confirmar contraseña",
    placeholder: "••••••••",
    requiredMessage: "Confirma tu contraseña",
  },
} satisfies Record<string, AuthFieldConfig>;
