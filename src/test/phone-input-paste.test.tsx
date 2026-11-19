import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { PhoneInput } from "../components/phone-input";
import type { PhoneInputProps } from "../components/phone-input";

const numberInput = () => screen.getByRole("textbox", { name: "Teléfono" });

const prefixButton = () => screen.getByRole("combobox", { name: /^Prefijo/ });

const renderAndPaste = async (props: PhoneInputProps, text: string) => {
  const onValueChange = vi.fn();
  const user = userEvent.setup();
  render(<PhoneInput {...props} onValueChange={onValueChange} />);
  await user.click(numberInput());
  await user.keyboard("{Control>}a{/Control}");
  await user.paste(text);
  return { onValueChange, user };
};

test("E-1: without splitPastedDialCode the paste stays as in 2.2.0", async () => {
  const { onValueChange } = await renderAndPaste({}, "+51 987 654 321");
  expect(numberInput()).toHaveValue("+51 987 654 321");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: null, number: "+51 987 654 321" });
});

test("E-4: digits without the split keep the dial code inside the number", async () => {
  const { onValueChange } = await renderAndPaste({ numberCharacters: "digits", defaultCountry: "PE" }, "+51 987 654 321");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "PE", number: "51987654321" });
});

test("E-5: the dial code moves to the prefix in a single change", async () => {
  const { onValueChange } = await renderAndPaste({ splitPastedDialCode: true }, "+51 987 654 321");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "PE", number: "987 654 321" });
  expect(numberInput()).toHaveValue("987 654 321");
  expect(prefixButton()).toHaveAccessibleName("Prefijo: Perú +51");
});

test("E-6: with digits only the local number is left", async () => {
  const { onValueChange } = await renderAndPaste({ splitPastedDialCode: true, numberCharacters: "digits" }, "+51 987 654 321");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "PE", number: "987654321" });
});

test("E-7: a chosen country that shares the code stays", async () => {
  const props: PhoneInputProps = { splitPastedDialCode: true, numberCharacters: "digits", defaultCountry: "CA" };
  const { onValueChange } = await renderAndPaste(props, "+1 (416) 555-0100");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "CA", number: "4165550100" });
});

test("E-8: another country gives way to the representative of the code", async () => {
  const props: PhoneInputProps = { splitPastedDialCode: true, numberCharacters: "digits", defaultCountry: "PE" };
  const { onValueChange } = await renderAndPaste(props, "+1 416 555 0100");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "US", number: "4165550100" });
});

test("E-9: an unknown code is pasted as usual, through the rule", async () => {
  const props: PhoneInputProps = { splitPastedDialCode: true, numberCharacters: "digits", defaultCountry: "PE" };
  const { onValueChange } = await renderAndPaste(props, "+999 123");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "PE", number: "999123" });
});

test("E-10: a paste that does not replace the whole number is a usual paste", async () => {
  const onValueChange = vi.fn();
  const user = userEvent.setup();
  render(<PhoneInput splitPastedDialCode numberCharacters="digits" defaultCountry="PE" onValueChange={onValueChange} />);
  await user.type(numberInput(), "99");
  await user.paste("+51 987");
  expect(onValueChange).toHaveBeenLastCalledWith({ country: "PE", number: "9951987" });
});

test("E-11 and E-12: the pasted number is cut to the maximum", async () => {
  const { onValueChange } = await renderAndPaste({ numberCharacters: "digits", maxNumberLength: 9 }, "987 654 321 000");
  expect(onValueChange).toHaveBeenLastCalledWith({ country: null, number: "987654321" });
});

test("E-12: split and cut together", async () => {
  const props: PhoneInputProps = { splitPastedDialCode: true, numberCharacters: "digits", maxNumberLength: 9 };
  const { onValueChange } = await renderAndPaste(props, "+51 987 654 321 000");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "PE", number: "987654321" });
});

test("a controlled input emits the split value and shows it once the app passes it back", async () => {
  const onValueChange = vi.fn();
  const user = userEvent.setup();
  const { rerender } = render(<PhoneInput splitPastedDialCode value={{ country: null, number: "" }} onValueChange={onValueChange} />);
  await user.click(numberInput());
  await user.paste("+598 99 123 456");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "UY", number: "99 123 456" });
  expect(numberInput()).toHaveValue("");
  rerender(<PhoneInput splitPastedDialCode value={{ country: "UY", number: "99 123 456" }} onValueChange={onValueChange} />);
  expect(numberInput()).toHaveValue("99 123 456");
});
