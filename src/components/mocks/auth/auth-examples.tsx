import type { AuthExtraField, LoginFormProps, SignUpFormProps } from "../../auth";
import { CUSTOM_THEME_CLASS_NAME } from "./auth-demo-config";
import type { AuthDemoExample } from "./auth-demo-config";
import type { AuthDemoState } from "./use-auth-demo";

const sharedProps = (demo: AuthDemoState) => ({
  onSubmit: demo.submit,
  submitting: demo.submitting,
  fieldErrors: demo.fieldErrors,
});

const googleProps = (demo: AuthDemoState) => ({
  onClick: () => demo.record("google.onClick"),
});

const EXTRA_FIELDS: AuthExtraField[] = [
  { name: "phone", label: "Teléfono", type: "tel", placeholder: "999 111 222" },
  { name: "teamSize", label: "Tamaño del equipo", type: "number", placeholder: "10" },
  {
    name: "role",
    label: "Rol",
    type: "select",
    required: true,
    placeholder: "Elige tu rol",
    options: [
      { value: "dev", label: "Desarrollo" },
      { value: "design", label: "Diseño" },
      { value: "product", label: "Producto" },
    ],
  },
  { name: "website", label: "Sitio web", type: "url", placeholder: "https://empresa.com" },
  { name: "source", label: "¿Cómo nos conociste?", type: "textarea", placeholder: "Cuéntanos en pocas palabras" },
  {
    name: "terms",
    label: (
      <>
        Acepto los <a href="#terminos" className="underline">términos y condiciones</a>
      </>
    ),
    type: "checkbox",
    required: true,
  },
];

const basicLogin = (demo: AuthDemoState): LoginFormProps => sharedProps(demo);

const completeLogin = (demo: AuthDemoState): LoginFormProps => ({
  ...sharedProps(demo),
  forgotPassword: { onClick: ({ email }) => demo.record("forgotPassword.onClick", { email }) },
  signUpLink: { onClick: () => demo.switchForm("signup") },
  google: googleProps(demo),
});

const customLogin = (demo: AuthDemoState): LoginFormProps => ({
  ...completeLogin(demo),
  className: CUSTOM_THEME_CLASS_NAME,
  width: 400,
  fields: { email: { label: "Correo corporativo", placeholder: "nombre@empresa.com" } },
  texts: {
    title: "Bienvenido de nuevo",
    subtitle: "Ingresa con tu cuenta de la empresa",
    submit: "Entrar",
    forgotPassword: "Recuperar contraseña",
    signUpLink: "Crea una cuenta",
  },
});

const basicSignUp = (demo: AuthDemoState): SignUpFormProps => sharedProps(demo);

const completeSignUp = (demo: AuthDemoState): SignUpFormProps => ({
  ...sharedProps(demo),
  passwordRules: { minLength: 8, uppercase: true, number: true, symbol: true },
  extraFields: EXTRA_FIELDS,
  fieldOrder: ["firstName", "lastName", "email", "phone", "password", "confirmPassword"],
  google: googleProps(demo),
  signInLink: { onClick: () => demo.switchForm("login") },
});

const customSignUp = (demo: AuthDemoState): SignUpFormProps => ({
  ...completeSignUp(demo),
  className: CUSTOM_THEME_CLASS_NAME,
  width: 520,
  fields: {
    firstName: { label: "Nombres", required: true, requiredMessage: "Ingresa tus nombres" },
    lastName: { label: "Apellidos", required: true, requiredMessage: "Ingresa tus apellidos" },
    confirmPassword: { label: "Repite la contraseña", requiredMessage: "Repite tu contraseña" },
  },
  texts: { title: "Únete al equipo", subtitle: "Tu espacio de trabajo en dos minutos", submit: "Crear cuenta" },
});

export const LOGIN_EXAMPLES: Record<AuthDemoExample, (demo: AuthDemoState) => LoginFormProps> = {
  basic: basicLogin,
  complete: completeLogin,
  custom: customLogin,
};

export const SIGN_UP_EXAMPLES: Record<AuthDemoExample, (demo: AuthDemoState) => SignUpFormProps> = {
  basic: basicSignUp,
  complete: completeSignUp,
  custom: customSignUp,
};
