import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { LoginForm } from "../components/auth/LoginForm";
import { DEFAULT_LOGIN_TEXTS } from "../components/auth/constants";
import type { LoginFormProps } from "../components/auth/types";

const renderLogin = (props: Partial<LoginFormProps> = {}) => {
  const onSubmit = vi.fn();
  const view = render(<LoginForm onSubmit={onSubmit} {...props} />);
  return { ...view, onSubmit, user: userEvent.setup() };
};

const emailInput = () => screen.getByLabelText(/^Email/);
const passwordInput = () => screen.getByLabelText(/^Contraseña/);
const submitButton = () => screen.getByRole("button", { name: DEFAULT_LOGIN_TEXTS.submit });

test("renders the login with its defaults and none of the optional parts", () => {
  const { container } = renderLogin();
  expect(screen.getByRole("heading", { level: 1, name: "Iniciar sesión" })).toBeInTheDocument();
  expect(emailInput()).toHaveAttribute("type", "email");
  expect(emailInput()).toHaveAttribute("autocomplete", "email");
  expect(passwordInput()).toHaveAttribute("autocomplete", "current-password");
  expect(container.querySelector(".gdy-auth")).toHaveAttribute("data-form", "login");
  expect(container.querySelector(".gdy-auth-divider")).toBeNull();
  expect(screen.queryByText(DEFAULT_LOGIN_TEXTS.google)).toBeNull();
  expect(screen.queryByText(DEFAULT_LOGIN_TEXTS.forgotPassword)).toBeNull();
  expect(screen.queryByText(DEFAULT_LOGIN_TEXTS.signUpLink)).toBeNull();
});

test("an empty submit shows both errors, focuses the email and emits nothing", async () => {
  const { onSubmit, user } = renderLogin();
  await user.click(submitButton());
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText("Ingresa tu email")).toBeInTheDocument();
  expect(screen.getByText("Ingresa tu contraseña")).toBeInTheDocument();
  expect(emailInput()).toHaveAttribute("aria-invalid", "true");
  expect(emailInput()).toHaveAccessibleDescription("Ingresa tu email");
  expect(emailInput()).toHaveFocus();
});

test("an invalid email is reported on blur and cleared once fixed", async () => {
  const { user } = renderLogin();
  await user.type(emailInput(), "hola@");
  await user.tab();
  expect(screen.getByText(DEFAULT_LOGIN_TEXTS.invalidEmail)).toBeInTheDocument();
  await user.type(emailInput(), "empresa.com");
  expect(screen.queryByText(DEFAULT_LOGIN_TEXTS.invalidEmail)).toBeNull();
  expect(emailInput()).not.toHaveAttribute("aria-invalid");
});

test("a valid submit emits the normalized values", async () => {
  const { onSubmit, user } = renderLogin();
  await user.type(emailInput(), " Ana@Empresa.com ");
  await user.type(passwordInput(), "clave secreta");
  await user.click(submitButton());
  expect(onSubmit).toHaveBeenCalledWith({ email: "ana@empresa.com", password: "clave secreta" });
});

test("the eye toggles the password visibility with aria-pressed", async () => {
  const { user } = renderLogin();
  const toggle = screen.getByRole("button", { name: DEFAULT_LOGIN_TEXTS.showPassword });
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  await user.click(toggle);
  expect(passwordInput()).toHaveAttribute("type", "text");
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(toggle).toHaveAttribute("title", DEFAULT_LOGIN_TEXTS.hidePassword);
});

test("the optional links and Google emit their events", async () => {
  const onForgot = vi.fn();
  const onGoogle = vi.fn();
  const { container, user } = renderLogin({
    forgotPassword: { onClick: onForgot },
    signUpLink: { href: "/registro" },
    google: { onClick: onGoogle },
  });
  await user.type(emailInput(), "ana@empresa.com");
  await user.click(screen.getByRole("button", { name: DEFAULT_LOGIN_TEXTS.forgotPassword }));
  expect(onForgot).toHaveBeenCalledWith(expect.objectContaining({ email: "ana@empresa.com" }));
  expect(screen.getByRole("link", { name: DEFAULT_LOGIN_TEXTS.signUpLink })).toHaveAttribute("href", "/registro");
  await user.click(screen.getByRole("button", { name: DEFAULT_LOGIN_TEXTS.google }));
  expect(onGoogle).toHaveBeenCalledTimes(1);
  expect(container.querySelector(".gdy-auth-divider")).toHaveTextContent("o");
});

test("while submitting the buttons are blocked and the server error is announced", () => {
  renderLogin({ submitting: true, error: "Credenciales inválidas", google: { onClick: vi.fn() } });
  expect(screen.getByRole("button", { name: DEFAULT_LOGIN_TEXTS.submitting })).toBeDisabled();
  expect(screen.getByRole("button", { name: DEFAULT_LOGIN_TEXTS.google })).toBeDisabled();
  expect(screen.getByRole("alert")).toHaveTextContent("Credenciales inválidas");
});

test("labels, texts and width can be customized", async () => {
  const { container, user } = renderLogin({
    fields: { email: { label: "Correo", placeholder: "nombre@empresa.com" } },
    texts: { title: "Bienvenido", submit: "Entrar" },
    width: 380,
  });
  expect(screen.getByRole("heading", { name: "Bienvenido" })).toBeInTheDocument();
  expect(screen.getByLabelText(/^Correo/)).toHaveAttribute("placeholder", "nombre@empresa.com");
  await user.click(screen.getByRole("button", { name: "Entrar" }));
  expect(screen.getByText("Ingresa tu correo")).toBeInTheDocument();
  const root = container.querySelector(".gdy-auth") as HTMLElement;
  expect(root.style.getPropertyValue("--gdy-auth-width")).toBe("380px");
});

test("a server field error shows until its field is edited", async () => {
  const { user } = renderLogin({ fieldErrors: { email: "Cuenta bloqueada" } });
  expect(emailInput()).toHaveAccessibleDescription("Cuenta bloqueada");
  await user.type(emailInput(), "a");
  expect(screen.queryByText("Cuenta bloqueada")).toBeNull();
});

test("pressing a button or link keeps the focus in the field, so no message moves it mid-click", () => {
  renderLogin({ forgotPassword: { onClick: vi.fn() }, google: { onClick: vi.fn() } });
  emailInput().focus();
  const targets = [
    submitButton(),
    screen.getByRole("button", { name: DEFAULT_LOGIN_TEXTS.forgotPassword }),
    screen.getByRole("button", { name: DEFAULT_LOGIN_TEXTS.google }),
  ];
  expect(targets.map((target) => fireEvent.mouseDown(target))).toEqual([false, false, false]);
});

test("tabbing through an untouched field does not flag it", async () => {
  const { user } = renderLogin();
  await user.click(emailInput());
  await user.tab();
  expect(emailInput()).not.toHaveAttribute("aria-invalid");
  expect(screen.queryByText("Ingresa tu email")).toBeNull();
});
