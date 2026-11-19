import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { CountrySelect } from "../components/country-select";
import { getOptionByName } from "./option-queries";

const reachedDocument = vi.fn();

const listenOnDocument = (eventNames: string[]) => {
  eventNames.forEach((eventName) => document.addEventListener(eventName, reachedDocument));
  return () => eventNames.forEach((eventName) => document.removeEventListener(eventName, reachedDocument));
};

const openCountryList = async () => {
  render(<CountrySelect />);
  await userEvent.setup().click(screen.getByRole("combobox", { name: "País" }));
  return getOptionByName("Chile");
};

afterEach(() => reachedDocument.mockClear());

test("the wheel and the finger over an open panel do not reach the document, where modal scroll locks cancel them", async () => {
  const option = await openCountryList();
  const stopListening = listenOnDocument(["wheel", "touchmove"]);
  fireEvent.wheel(option, { deltaY: 100 });
  fireEvent.touchMove(option);
  stopListening();
  expect(reachedDocument).not.toHaveBeenCalled();
});

test("the keys pressed in an open panel still reach the document", async () => {
  const option = await openCountryList();
  const stopListening = listenOnDocument(["keydown"]);
  fireEvent.keyDown(option, { key: "Shift" });
  stopListening();
  expect(reachedDocument).toHaveBeenCalledTimes(1);
});
