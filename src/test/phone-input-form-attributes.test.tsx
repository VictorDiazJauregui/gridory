import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { InvalidMaxNumberLengthError, PhoneInput } from "../components/phone-input";
import type { PhoneInputProps } from "../components/phone-input";
import { expectRenderError } from "./expect-render-error";

const numberInput = () => screen.getByRole("textbox", { name: "Teléfono" });

const prefixButton = () => screen.getByRole("combobox", { name: /^Prefijo/ });

const findBox = () => document.querySelector(".gdy-phone-input");

const renderPhoneInput = (props: PhoneInputProps = {}) => {
  const user = userEvent.setup();
  return { user, ...render(<PhoneInput {...props} />) };
};

test("without the new props the number keeps its generated id, no name and stays enabled", () => {
  renderPhoneInput();
  expect(numberInput().id).toMatch(/-control$/);
  expect(numberInput()).not.toHaveAttribute("name");
  expect(numberInput()).toBeEnabled();
  expect(prefixButton()).toBeEnabled();
  expect(findBox()).not.toHaveAttribute("data-disabled");
});

test("id and name go to the number, and the field label points at that id", () => {
  renderPhoneInput({ id: "whatsapp", name: "whatsapp" });
  expect(numberInput()).toHaveAttribute("id", "whatsapp");
  expect(numberInput()).toHaveAttribute("name", "whatsapp");
  expect(screen.getByText("Teléfono")).toHaveAttribute("for", "whatsapp");
  expect(document.querySelector<HTMLInputElement>("input[name=whatsapp]")).toBe(numberInput());
});

test("an outside label with htmlFor focuses the number", async () => {
  const user = userEvent.setup();
  render(
    <>
      <label htmlFor="mobile">Celular</label>
      <PhoneInput id="mobile" aria-label="Celular" />
    </>,
  );
  await user.click(screen.getByText("Celular", { selector: "label" }));
  expect(document.getElementById("mobile")).toHaveFocus();
});

test("disabled: prefix and number are disabled, the box says so and nothing can be typed", async () => {
  const onValueChange = vi.fn();
  const { user } = renderPhoneInput({ disabled: true, defaultCountry: "PE", onValueChange });
  expect(numberInput()).toBeDisabled();
  expect(prefixButton()).toBeDisabled();
  expect(findBox()).toHaveAttribute("data-disabled");
  await user.type(numberInput(), "999");
  await user.click(prefixButton());
  expect(numberInput()).toHaveValue("");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(onValueChange).not.toHaveBeenCalled();
});

test("disabling the control while its list is open closes the list, and enabling it keeps it closed", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<PhoneInput />);
  await user.click(prefixButton());
  expect(await screen.findByRole("dialog")).toBeInTheDocument();
  rerender(<PhoneInput disabled />);
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  rerender(<PhoneInput />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("E-2: without numberCharacters the 2.2.0 rule stays", async () => {
  const onValueChange = vi.fn();
  const { user } = renderPhoneInput({ defaultCountry: "PE", onValueChange });
  await user.type(numberInput(), "98a7-65 4/3");
  expect(numberInput()).toHaveValue("987-65 43");
  expect(onValueChange).toHaveBeenLastCalledWith({ country: "PE", number: "987-65 43" });
});

test("E-3: numberCharacters digits keeps digits only", async () => {
  const onValueChange = vi.fn();
  const { user } = renderPhoneInput({ defaultCountry: "PE", numberCharacters: "digits", onValueChange });
  await user.type(numberInput(), "98a7-65 4/3");
  expect(numberInput()).toHaveValue("9876543");
  expect(onValueChange).toHaveBeenLastCalledWith({ country: "PE", number: "9876543" });
});

test("maxNumberLength stops typing at the maximum", async () => {
  const onValueChange = vi.fn();
  const { user } = renderPhoneInput({ numberCharacters: "digits", maxNumberLength: 9, onValueChange });
  await user.type(numberInput(), "98765432100");
  expect(numberInput()).toHaveValue("987654321");
  expect(onValueChange).toHaveBeenCalledTimes(9);
});

test("E-13 to E-15: the starting value is shown as given, a longer one is refused and a deletion passes", async () => {
  const onValueChange = vi.fn();
  const { user } = renderPhoneInput({
    numberCharacters: "digits",
    maxNumberLength: 9,
    splitPastedDialCode: true,
    defaultValue: { country: "PE", number: "987654321 / 912345678" },
    onValueChange,
  });
  expect(numberInput()).toHaveValue("987654321 / 912345678");
  expect(onValueChange).not.toHaveBeenCalled();
  await user.type(numberInput(), "0");
  expect(numberInput()).toHaveValue("987654321 / 912345678");
  expect(onValueChange).not.toHaveBeenCalled();
  await user.type(numberInput(), "{Backspace}");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "PE", number: "98765432191234567" });
});

test("a controlled starting value is not filtered either", () => {
  renderPhoneInput({ numberCharacters: "digits", maxNumberLength: 4, value: { country: "PE", number: "+51 (01) 555" } });
  expect(numberInput()).toHaveValue("+51 (01) 555");
});

test.each([0, -1, 3.5])("maxNumberLength %s throws InvalidMaxNumberLengthError", (maxNumberLength) => {
  expectRenderError(<PhoneInput maxNumberLength={maxNumberLength} />, InvalidMaxNumberLengthError);
});
