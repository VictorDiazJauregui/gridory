import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { SignUpForm } from "../components/auth/SignUpForm";
import { DEFAULT_SIGN_UP_TEXTS } from "../components/auth/constants";
import type { AuthExtraField, SignUpFormProps } from "../components/auth/types";

const PHONE_FIELD: AuthExtraField = { name: "phone", label: "Teléfono", type: "tel", placeholder: "999 111 222" };

const renderSignUp = (props: Partial<SignUpFormProps> = {}) => {
  const onSubmit = vi.fn();
  const view = render(
    <SignUpForm onSubmit={onSubmit} fields={{ firstName: false, lastName: false, confirmPassword: false }} extraFields={[PHONE_FIELD]} {...props} />,
  );
  return { ...view, onSubmit, user: userEvent.setup() };
};

const phoneNumber = () => screen.getByLabelText(/^Teléfono/);
const prefix = () => screen.getByRole("combobox", { name: /^Prefijo/ });
const submit = () => screen.getByRole("button", { name: DEFAULT_SIGN_UP_TEXTS.submit });

const fillCredentials = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/^Email/), "ana@empresa.com");
  await user.type(screen.getByLabelText(/^Contraseña/), "Clave-123");
};

const choosePeru = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(prefix());
  await user.type(await screen.findByRole("combobox", { name: "Buscar prefijo" }), "peru");
  await user.click(screen.getByRole("option", { name: /^Perú/ }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
};

test("a tel field renders the prefix picker and a tel number named by the form's label", () => {
  renderSignUp();
  expect(phoneNumber()).toHaveAttribute("type", "tel");
  expect(phoneNumber()).toHaveAttribute("placeholder", "999 111 222");
  expect(prefix()).toHaveTextContent("País");
  expect(document.querySelector(".gdy-auth-field .gdy-phone-input.gdy-auth-phone")).not.toBeNull();
});

test("letters typed in the number are dropped", async () => {
  const { user } = renderSignUp();
  await user.type(phoneNumber(), "abc 999-111");
  expect(phoneNumber()).toHaveValue(" 999-111");
});

test("the submitted value holds the country and the trimmed number", async () => {
  const { onSubmit, user } = renderSignUp();
  await fillCredentials(user);
  await choosePeru(user);
  await user.type(phoneNumber(), " 999 111 222 ");
  await user.click(submit());
  expect(onSubmit).toHaveBeenCalledWith({
    email: "ana@empresa.com",
    password: "Clave-123",
    phone: { country: "PE", number: "999 111 222" },
  });
});

test("an optional phone left empty is submitted as an empty value", async () => {
  const { onSubmit, user } = renderSignUp();
  await fillCredentials(user);
  await user.click(submit());
  expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ phone: { country: null, number: "" } }));
});

test("a required phone left empty shows the required error, described by the number, and gets the focus", async () => {
  const { onSubmit, user } = renderSignUp({ extraFields: [{ ...PHONE_FIELD, required: true }] });
  await fillCredentials(user);
  await user.click(submit());
  expect(onSubmit).not.toHaveBeenCalled();
  expect(phoneNumber()).toHaveAttribute("aria-invalid", "true");
  expect(phoneNumber()).toHaveAttribute("aria-required", "true");
  expect(phoneNumber()).toHaveAccessibleDescription("Ingresa tu teléfono");
  expect(phoneNumber()).toHaveFocus();
  expect(document.querySelector(".gdy-auth-phone")).toHaveAttribute("data-invalid");
});

test("a number without a country is an error, with a replaceable text", async () => {
  const { onSubmit, user } = renderSignUp({ texts: { phoneCountryRequired: "Choose the country code" } });
  await fillCredentials(user);
  await user.type(phoneNumber(), "999 111 222");
  await user.click(submit());
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText("Choose the country code")).toBeInTheDocument();
  await choosePeru(user);
  expect(screen.queryByText("Choose the country code")).not.toBeInTheDocument();
});

test("a phone default given as a plain string becomes the number, with no country", () => {
  renderSignUp({ defaultValues: { phone: "999 111 222" } });
  expect(phoneNumber()).toHaveValue("999 111 222");
  expect(prefix()).toHaveTextContent("País");
});
