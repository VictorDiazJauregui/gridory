import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { SignUpForm } from "../components/auth/SignUpForm";
import { DEFAULT_SIGN_UP_TEXTS } from "../components/auth/constants";
import type { AuthExtraField, AuthStandardSchema, SignUpFormProps } from "../components/auth/types";
import {
  DuplicateAuthFieldError,
  UnknownAuthFieldError,
} from "../components/auth/validation/auth-field-errors";
import { expectRenderError } from "./expect-render-error";

const renderSignUp = (props: Partial<SignUpFormProps> = {}) => {
  const onSubmit = vi.fn();
  const view = render(<SignUpForm onSubmit={onSubmit} {...props} />);
  return { ...view, onSubmit, user: userEvent.setup() };
};

const input = (label: RegExp) => screen.getByLabelText(label);
const submit = () => screen.getByRole("button", { name: DEFAULT_SIGN_UP_TEXTS.submit });

const fillCredentials = async (user: ReturnType<typeof userEvent.setup>, password = "Clave-123") => {
  await user.type(input(/^Email/), "ana@empresa.com");
  await user.type(input(/^Contraseña/), password);
  await user.type(input(/^Confirmar contraseña/), password);
};

const EXTRA_FIELDS: AuthExtraField[] = [
  { name: "phone", label: "Teléfono", type: "tel" },
  { name: "about", label: "Sobre ti", type: "textarea" },
  { name: "role", label: "Rol", type: "select", required: true, options: [{ value: "dev", label: "Desarrollo" }] },
  { name: "terms", label: "Acepto los términos", type: "checkbox", required: true },
];

test("renders the sign-up centered title without subtitle and marks the required fields", () => {
  const { container } = renderSignUp();
  expect(screen.getByRole("heading", { name: "Crea tu cuenta" })).toBeInTheDocument();
  expect(container.querySelector(".gdy-auth-subtitle")).toBeNull();
  expect(input(/^Nombre/)).not.toHaveAttribute("aria-required");
  expect(input(/^Email/)).toHaveAttribute("aria-required", "true");
  expect(input(/^Confirmar contraseña/)).toHaveAttribute("autocomplete", "new-password");
  expect(container.querySelectorAll(".gdy-auth-required")).toHaveLength(3);
  expect(container.querySelector(".gdy-auth-name-row")).not.toBeNull();
});

test("focus goes to the first invalid field in visual order", async () => {
  const { onSubmit, user } = renderSignUp({ fields: { firstName: { required: true } } });
  await user.type(input(/^Email/), "ana@empresa.com");
  await user.click(submit());
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText("Ingresa tu nombre")).toBeInTheDocument();
  expect(input(/^Nombre/)).toHaveFocus();
  expect(screen.getByText("Confirma tu contraseña")).toBeInTheDocument();
});

test("each password field has its own independent eye", async () => {
  const { user } = renderSignUp();
  const [passwordEye, confirmEye] = screen.getAllByRole("button", { name: DEFAULT_SIGN_UP_TEXTS.showPassword });
  await user.click(passwordEye);
  expect(input(/^Contraseña/)).toHaveAttribute("type", "text");
  expect(input(/^Confirmar contraseña/)).toHaveAttribute("type", "password");
  await user.click(confirmEye);
  expect(input(/^Confirmar contraseña/)).toHaveAttribute("type", "text");
});

test("the passwords must match", async () => {
  const { onSubmit, user } = renderSignUp();
  await user.type(input(/^Email/), "ana@empresa.com");
  await user.type(input(/^Contraseña/), "Clave-123");
  await user.type(input(/^Confirmar contraseña/), "Clave-124");
  await user.click(submit());
  expect(screen.getByText(DEFAULT_SIGN_UP_TEXTS.passwordMismatch)).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("the password rules update live and block a weak password", async () => {
  const { container, onSubmit, user } = renderSignUp({ passwordRules: { minLength: 8, uppercase: true } });
  const statuses = () => [...container.querySelectorAll(".gdy-auth-rule")].map((rule) => rule.getAttribute("data-status"));
  expect(statuses()).toEqual(["pending", "pending"]);
  await fillCredentials(user, "Corta");
  expect(statuses()).toEqual(["unmet", "met"]);
  await user.click(submit());
  expect(screen.getByText(DEFAULT_SIGN_UP_TEXTS.passwordRequirements)).toBeInTheDocument();
  expect(input(/^Contraseña/)).toHaveFocus();
  expect(onSubmit).not.toHaveBeenCalled();
});

const WITHOUT_NAMES: Partial<SignUpFormProps> = {
  extraFields: EXTRA_FIELDS,
  fields: { firstName: false, lastName: false },
};

test("required extra fields report their own messages and take the focus", async () => {
  const { onSubmit, user } = renderSignUp(WITHOUT_NAMES);
  await fillCredentials(user);
  await user.click(submit());
  expect(screen.getByText(DEFAULT_SIGN_UP_TEXTS.selectRequired)).toBeInTheDocument();
  expect(screen.getByText(DEFAULT_SIGN_UP_TEXTS.checkboxRequired)).toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: /^Rol/ })).toHaveFocus();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("extra fields of every kind are emitted flat next to the credentials", async () => {
  const { onSubmit, user } = renderSignUp(WITHOUT_NAMES);
  await fillCredentials(user);
  await user.type(input(/^Teléfono/), "999 111 222");
  await user.click(screen.getByRole("combobox", { name: /^Rol/ }));
  await user.click(await screen.findByRole("option", { name: "Desarrollo" }));
  await user.click(input(/^Acepto los términos/));
  await user.click(submit());
  expect(onSubmit).toHaveBeenCalledWith({
    email: "ana@empresa.com",
    password: "Clave-123",
    confirmPassword: "Clave-123",
    phone: "999 111 222",
    about: "",
    role: "dev",
    terms: true,
  });
});

test("fieldOrder places an extra field among the built-in ones", () => {
  const { container } = renderSignUp({
    extraFields: [{ name: "phone", label: "Teléfono", type: "tel" }],
    fieldOrder: ["email", "phone", "password"],
  });
  const names = [...container.querySelectorAll("input")].map((element) => element.name);
  expect(names).toEqual(["email", "phone", "password", "firstName", "lastName", "confirmPassword"]);
});

const signUpFormWith = (props: Partial<SignUpFormProps>) => <SignUpForm onSubmit={vi.fn()} {...props} />;

test("configuration mistakes throw descriptive errors", () => {
  expectRenderError(signUpFormWith({ extraFields: [{ name: "email", label: "Otro email" }] }), DuplicateAuthFieldError);
  expectRenderError(signUpFormWith({ fieldOrder: ["telefono"] }), UnknownAuthFieldError);
});

test("a Standard Schema can veto the submit and point at a field", async () => {
  const schema: AuthStandardSchema = {
    "~standard": {
      version: 1,
      vendor: "test",
      validate: (value) =>
        (value as { email: string }).email.endsWith("@empresa.com")
          ? { issues: [{ message: "Usa tu email personal", path: ["email"] }] }
          : { value },
    },
  };
  const { onSubmit, user } = renderSignUp({ schema });
  await fillCredentials(user);
  await user.click(submit());
  await waitFor(() => expect(input(/^Email/)).toHaveFocus());
  expect(screen.getByText("Usa tu email personal")).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("google.render mounts the app's button over a paint-only face", () => {
  const { container } = renderSignUp({
    google: { render: () => <button type="button">Botón oficial</button> },
    signInLink: { onClick: vi.fn() },
  });
  const face = container.querySelector(".gdy-auth-google") as HTMLElement;
  expect(face).toHaveAttribute("aria-hidden", "true");
  expect(face).toHaveAttribute("tabindex", "-1");
  const overlay = container.querySelector(".gdy-auth-google-overlay") as HTMLElement;
  expect(within(overlay).getByRole("button", { name: "Botón oficial" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: DEFAULT_SIGN_UP_TEXTS.signInLink })).toBeInTheDocument();
});
