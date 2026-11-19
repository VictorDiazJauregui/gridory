import { render, screen, waitFor } from "@testing-library/react";
import type { CSSProperties } from "react";
import { Dialog } from "radix-ui";
import { expect } from "vitest";
import { userEvent } from "vitest/browser";
import { CountrySelect } from "../components/country-select";
import { PhoneInput } from "../components/phone-input";
import { findRequiredElement } from "./browser/elements";

export const LIST_SELECTOR = ".gdy-listbox-options";
export const COUNTRY_FIELD = "País";
export const DIAL_CODE_FIELD = /^Prefijo/;

const LOCAL_FLAG_URL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const TALL_SPACER: CSSProperties = { height: "3000px" };
// Fixed and scrollable like a long form in a modal, so a wheel that leaked into it would move it.
const SCROLLABLE_DIALOG: CSSProperties = { position: "fixed", top: "20px", left: "20px", maxHeight: "300px", overflowY: "auto" };

const resolveLocalFlag = () => LOCAL_FLAG_URL;

const CONTACT_FIELDS = (
  <>
    <CountrySelect flagUrl={resolveLocalFlag} />
    <PhoneInput flagUrl={resolveLocalFlag} />
  </>
);

// The overlay matters: Radix locks the page scroll on it, so a dialog without one would hide the bug.
export const renderContactDialog = () =>
  render(
    <>
      <div style={TALL_SPACER} />
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content aria-describedby={undefined} style={SCROLLABLE_DIALOG}>
            <Dialog.Title>Contacto</Dialog.Title>
            {CONTACT_FIELDS}
            <div style={TALL_SPACER} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>,
  );

export const renderContactPage = () =>
  render(
    <>
      {CONTACT_FIELDS}
      <div style={TALL_SPACER} />
    </>,
  );

export const contactDialog = () => screen.getByRole("dialog", { name: "Contacto" });

export const openList = async (fieldName: string | RegExp): Promise<HTMLElement> => {
  await userEvent.click(screen.getByRole("combobox", { name: fieldName }));
  await waitFor(() => expect(document.querySelector(LIST_SELECTOR)).not.toBeNull());
  return findRequiredElement(document, LIST_SELECTOR) as HTMLElement;
};

export const scrollToListEnd = (list: HTMLElement): void => {
  list.scrollTop = list.scrollHeight;
};
