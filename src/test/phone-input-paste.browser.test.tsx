import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PhoneInput } from "../components/phone-input";

const LOCAL_FLAG_URL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

const numberInput = () => screen.getByRole<HTMLInputElement>("textbox", { name: "Teléfono" });

const pasteText = (input: HTMLInputElement, text: string): boolean => {
  const clipboardData = new DataTransfer();
  clipboardData.setData("text/plain", text);
  input.focus();
  input.select();
  return input.dispatchEvent(new ClipboardEvent("paste", { clipboardData, bubbles: true, cancelable: true }));
};

test("a real Chrome paste of +51 987 654 321 is taken over: prefix Peru and the local number", async () => {
  const onValueChange = vi.fn();
  render(<PhoneInput splitPastedDialCode flagUrl={() => LOCAL_FLAG_URL} onValueChange={onValueChange} />);
  const notCancelled = pasteText(numberInput(), "+51 987 654 321");
  expect(notCancelled).toBe(false);
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ country: "PE", number: "987 654 321" });
  await expect.poll(() => numberInput().value).toBe("987 654 321");
  expect(screen.getByRole("combobox", { name: "Prefijo: Perú +51" })).toBeInTheDocument();
});

test("without splitPastedDialCode the browser keeps the paste", () => {
  render(<PhoneInput flagUrl={() => LOCAL_FLAG_URL} />);
  expect(pasteText(numberInput(), "+51 987 654 321")).toBe(true);
});
