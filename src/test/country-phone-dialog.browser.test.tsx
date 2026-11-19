import { render, screen, waitFor } from "@testing-library/react";
import { Dialog } from "radix-ui";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { CountrySelect } from "../components/country-select";
import { PhoneInput } from "../components/phone-input";
import { getOptionByName } from "./option-queries";

const LOCAL_FLAG_URL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

const resolveLocalFlag = () => LOCAL_FLAG_URL;

const renderInDialog = (onCountryChange: () => void, onPhoneChange: () => void) =>
  render(
    <Dialog.Root defaultOpen>
      <Dialog.Portal>
        <Dialog.Content aria-describedby={undefined}>
          <Dialog.Title>Contacto</Dialog.Title>
          <CountrySelect flagUrl={resolveLocalFlag} onValueChange={onCountryChange} />
          <PhoneInput flagUrl={resolveLocalFlag} onValueChange={onPhoneChange} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>,
  );

const contactDialog = () => screen.getByRole("dialog", { name: "Contacto" });

const countryCombobox = () => screen.getByRole("combobox", { name: "País" });

const prefix = () => screen.getByRole("combobox", { name: /^Prefijo/ });

const listCount = () => screen.queryAllByRole("listbox").length;

test("inside a modal the country list takes clicks, and Escape closes only the list", async () => {
  const onCountryChange = vi.fn();
  renderInDialog(onCountryChange, vi.fn());
  await userEvent.click(countryCombobox());
  await userEvent.keyboard("chi");
  await userEvent.click(getOptionByName("Chile"));
  expect(onCountryChange).toHaveBeenLastCalledWith("CL");
  await userEvent.click(countryCombobox());
  await waitFor(() => expect(listCount()).toBe(1));
  await userEvent.keyboard("{Escape}");
  await waitFor(() => expect(listCount()).toBe(0));
  expect(contactDialog()).toBeVisible();
  expect(countryCombobox()).toHaveFocus();
});

test("inside a modal the dial code list works with the keyboard and hands the focus back", async () => {
  const onPhoneChange = vi.fn();
  renderInDialog(vi.fn(), onPhoneChange);
  prefix().focus();
  await userEvent.keyboard("{Enter}");
  await waitFor(() => expect(listCount()).toBe(1));
  await userEvent.keyboard("uruguay{Enter}");
  expect(onPhoneChange).toHaveBeenLastCalledWith({ country: "UY", number: "" });
  await waitFor(() => expect(listCount()).toBe(0));
  expect(contactDialog()).toBeVisible();
  expect(prefix()).toHaveFocus();
});
