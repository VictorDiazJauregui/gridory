import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { CountrySelect } from "../components/country-select";
import type { CountrySelectProps } from "../components/country-select";

const DATA_FLAG_URL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

const countryCombobox = () => screen.getByRole("combobox", { name: "País" });

const findBox = () => document.querySelector(".gdy-country-select");

const renderCountrySelect = (props: CountrySelectProps = {}) => {
  const user = userEvent.setup();
  return { user, ...render(<CountrySelect flagUrl={() => DATA_FLAG_URL} {...props} />) };
};

test("without the new props the combobox keeps its generated id, no name and stays enabled", () => {
  renderCountrySelect();
  const combobox = countryCombobox();
  expect(combobox.id).toMatch(/-control$/);
  expect(combobox).not.toHaveAttribute("name");
  expect(combobox).toBeEnabled();
  expect(findBox()).not.toHaveAttribute("data-disabled");
  expect(screen.getByText("País")).toHaveAttribute("for", combobox.id);
});

test("id and name go to the combobox, and the field label points at that id", () => {
  renderCountrySelect({ id: "country", name: "country" });
  const combobox = countryCombobox();
  expect(combobox).toHaveAttribute("id", "country");
  expect(combobox).toHaveAttribute("name", "country");
  expect(screen.getByText("País")).toHaveAttribute("for", "country");
});

test("an outside label with htmlFor names the combobox and opens it like a click", async () => {
  const user = userEvent.setup();
  render(
    <>
      <label id="residence-label" htmlFor="residence">Residencia</label>
      <CountrySelect id="residence" aria-labelledby="residence-label" />
    </>,
  );
  expect(screen.getByRole("combobox", { name: "Residencia" })).toBe(document.getElementById("residence"));
  await user.click(screen.getByText("Residencia"));
  expect(await screen.findByRole("dialog")).toBeInTheDocument();
});

test("the focus moves to the combobox by its id or its name, as a form does with its first error", () => {
  render(
    <form aria-label="Alta">
      <CountrySelect id="country" name="country" />
    </form>,
  );
  document.getElementById("country")?.focus();
  expect(countryCombobox()).toHaveFocus();
  countryCombobox().blur();
  screen.getByRole("form").querySelector<HTMLElement>("[name=country]")?.focus();
  expect(countryCombobox()).toHaveFocus();
});

test("disabled: the combobox is disabled, the box says so and a click does not open the list", async () => {
  const { user } = renderCountrySelect({ disabled: true, defaultValue: "PE" });
  expect(countryCombobox()).toBeDisabled();
  expect(findBox()).toHaveAttribute("data-disabled");
  expect(screen.getByRole("button", { name: "Quitar selección" })).toBeDisabled();
  await user.click(countryCombobox());
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("disabled in multiple mode: the remove buttons of the chips are disabled", () => {
  renderCountrySelect({ multiple: true, disabled: true, defaultValue: ["PE", "UY"] });
  expect(screen.getByRole("button", { name: "Quitar Perú" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Quitar Uruguay" })).toBeDisabled();
});

test("disabling the control while its list is open closes the list, and enabling it keeps it closed", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<CountrySelect flagUrl={() => DATA_FLAG_URL} />);
  await user.click(countryCombobox());
  expect(await screen.findByRole("dialog")).toBeInTheDocument();
  rerender(<CountrySelect flagUrl={() => DATA_FLAG_URL} disabled />);
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  rerender(<CountrySelect flagUrl={() => DATA_FLAG_URL} />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("a required control that is disabled shows no error of its own", async () => {
  const onValueChange = vi.fn();
  const user = userEvent.setup();
  const { rerender } = render(<CountrySelect required onValueChange={onValueChange} />);
  await user.click(countryCombobox());
  await user.keyboard("{Escape}");
  expect(await screen.findByText("Selecciona un país", { selector: ".gdy-field-error" })).toBeInTheDocument();
  rerender(<CountrySelect required disabled onValueChange={onValueChange} />);
  expect(screen.queryByText("Selecciona un país", { selector: ".gdy-field-error" })).not.toBeInTheDocument();
  expect(onValueChange).not.toHaveBeenCalled();
});
