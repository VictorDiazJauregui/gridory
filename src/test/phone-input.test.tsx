import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { PhoneInput } from "../components/phone-input";
import type { PhoneInputProps } from "../components/phone-input";

const prefixButton = (name: RegExp = /^Prefijo/) => screen.getByRole("combobox", { name });

const numberInput = (name = "Teléfono") => screen.getByRole("textbox", { name });

const searchBox = () => screen.getByRole("combobox", { name: "Buscar prefijo" });

const option = (name: RegExp) => screen.getByRole("option", { name });

const visibleOptionNames = () => screen.queryAllByRole("option").map((element) => element.textContent);

const renderPhoneInput = (props: PhoneInputProps = {}) => {
  const user = userEvent.setup();
  return { user, ...render(<PhoneInput {...props} />) };
};

const openList = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(prefixButton());
  return screen.findByRole("dialog");
};

const expectListClosed = () => waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

afterEach(() => vi.restoreAllMocks());

test("the number is a tel input named Teléfono by default, with no country chosen", () => {
  renderPhoneInput();
  const input = numberInput();
  expect(input).toHaveAttribute("type", "tel");
  expect(input).toHaveAttribute("inputmode", "tel");
  expect(input).toHaveAttribute("autocomplete", "tel-national");
  expect(prefixButton(/^Prefijo: País$/)).toHaveTextContent("País");
  expect(prefixButton()).toHaveAttribute("aria-haspopup", "dialog");
});

test("typing abc 999-111 keeps only the digits, the space and the hyphen", async () => {
  const onValueChange = vi.fn();
  const { user } = renderPhoneInput({ onValueChange });
  await user.type(numberInput(), "abc 999-111");
  expect(numberInput()).toHaveValue(" 999-111");
  expect(onValueChange).toHaveBeenLastCalledWith({ country: null, number: " 999-111" });
  expect(onValueChange).toHaveBeenCalledTimes(8);
});

test("pasting abc 999-111 drops the letters too", async () => {
  const onValueChange = vi.fn();
  const { user } = renderPhoneInput({ onValueChange });
  await user.click(numberInput());
  await user.paste("abc 999-111");
  expect(numberInput()).toHaveValue(" 999-111");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: null, number: " 999-111" });
});

test("a value made only of rejected characters emits nothing", () => {
  const onValueChange = vi.fn();
  renderPhoneInput({ onValueChange });
  fireEvent.change(numberInput(), { target: { value: "abc" } });
  expect(numberInput()).toHaveValue("");
  expect(onValueChange).not.toHaveBeenCalled();
});

test("searching peru, 51 and +51 finds Perú, and 51 does not find Portugal (+351)", async () => {
  const { user } = renderPhoneInput();
  await openList(user);
  await user.type(searchBox(), "peru");
  expect(visibleOptionNames()).toEqual(["Perú+51"]);
  await user.clear(searchBox());
  await user.type(searchBox(), "51");
  expect(visibleOptionNames()).toContain("Perú+51");
  expect(visibleOptionNames()).not.toContain("Portugal+351");
  await user.clear(searchBox());
  await user.type(searchBox(), "+51");
  expect(visibleOptionNames()).toEqual(["Perú+51"]);
});

test("choosing Canadá emits CA, closes the list and names the prefix after Canadá, not the United States", async () => {
  const onValueChange = vi.fn();
  const { user } = renderPhoneInput({ onValueChange });
  await openList(user);
  await user.type(searchBox(), "canad");
  await user.click(option(/^Canadá/));
  await expectListClosed();
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "CA", number: "" });
  expect(prefixButton(/^Prefijo: Canadá \+1$/)).toHaveFocus();
  expect(prefixButton()).toHaveTextContent("+1");
});

test("reopening with Canadá chosen marks it, makes it active and scrolls it into view", async () => {
  const scrollIntoView = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
  const { user } = renderPhoneInput({ defaultCountry: "CA" });
  await openList(user);
  const canada = option(/^Canadá/);
  expect(canada).toHaveAttribute("aria-selected", "true");
  expect(canada).toHaveAttribute("data-active");
  expect(option(/^Estados Unidos/)).toHaveAttribute("aria-selected", "false");
  expect(scrollIntoView.mock.contexts.at(-1)).toBe(canada);
});

test("choosing the country already chosen only closes the list", async () => {
  const onValueChange = vi.fn();
  const { user } = renderPhoneInput({ defaultCountry: "PE", onValueChange });
  await openList(user);
  await user.click(option(/^Perú/));
  await expectListClosed();
  expect(onValueChange).not.toHaveBeenCalled();
});

test("a controlled field shows the app's value and emits new objects without mutating it", async () => {
  const value = Object.freeze({ country: "PE" as const, number: "999" });
  const onValueChange = vi.fn();
  const { user } = renderPhoneInput({ value, onValueChange });
  await user.type(numberInput(), "1");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "PE", number: "9991" });
  expect(numberInput()).toHaveValue("999");
});

test("the label goes above by default or beside the field with labelPosition start", () => {
  const { container, rerender } = renderPhoneInput();
  expect(container.querySelector(".gdy-field")).toHaveAttribute("data-label-position", "top");
  rerender(<PhoneInput labelPosition="start" />);
  expect(container.querySelector(".gdy-field")).toHaveAttribute("data-label-position", "start");
});

test("required marks the label and the number, and shows no error of its own", async () => {
  const { user } = renderPhoneInput({ required: true });
  expect(numberInput()).toHaveAttribute("aria-required", "true");
  expect(screen.getByText("*")).toBeInTheDocument();
  await user.click(numberInput());
  await user.tab();
  expect(numberInput()).not.toHaveAttribute("aria-invalid");
});

test("the app's error is shown, described and marks the box as invalid", () => {
  const { container } = renderPhoneInput({ error: "Ingresa un teléfono válido" });
  expect(numberInput()).toHaveAttribute("aria-invalid", "true");
  expect(numberInput()).toHaveAccessibleDescription("Ingresa un teléfono válido");
  expect(container.querySelector(".gdy-phone-input")).toHaveAttribute("data-invalid");
});

test("texts, a custom label and aria-label replace the defaults", async () => {
  const texts = { countryPlaceholder: "Country", prefixButton: "Code: {country}", searchLabel: "Search code", noResults: "None" };
  const { user, rerender } = renderPhoneInput({ label: "Celular", texts });
  expect(numberInput("Celular")).toBeInTheDocument();
  expect(prefixButton(/^Code: Country$/)).toHaveTextContent("Country");
  await user.click(prefixButton(/^Code/));
  await user.type(await screen.findByRole("combobox", { name: "Search code" }), "zzz");
  expect(screen.getByText("None")).toBeInTheDocument();
  rerender(<PhoneInput aria-label="Mobile" />);
  expect(numberInput("Mobile")).toBeInTheDocument();
});

test("className, classNames and width reach their parts next to the gdy hooks", () => {
  const classNames = { root: "my-root", prefix: "my-prefix", number: "my-number" };
  const { container } = renderPhoneInput({ className: "my-field", classNames, width: 320 });
  expect(container.querySelector(".gdy-phone-input")).toHaveClass("my-field", "my-root");
  expect(prefixButton()).toHaveClass("gdy-phone-input-prefix", "my-prefix");
  expect(numberInput()).toHaveClass("gdy-phone-input-number", "my-number");
  const frame = container.querySelector<HTMLElement>(".gdy-phone-input-frame");
  expect(frame?.style.getPropertyValue("--gdy-phone-input-width")).toBe("320px");
});
