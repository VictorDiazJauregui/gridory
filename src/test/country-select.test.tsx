import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, expectTypeOf, test, vi } from "vitest";
import { CountrySelect, InvalidSelectionRangeError } from "../components/country-select";
import type {
  CountryCode,
  CountrySelectProps,
  MultipleCountrySelectProps,
  SingleCountrySelectProps,
} from "../components/country-select";
import { expectRenderError } from "./expect-render-error";

const DATA_FLAG_URL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

const countryCombobox = (name = "País") => screen.getByRole("combobox", { name });

const searchBox = () => screen.getByRole("combobox", { name: "Buscar país" });

const option = (name: string) => screen.getByRole("option", { name });

const visibleOptionNames = () => screen.queryAllByRole("option").map((element) => element.textContent);

const renderCountrySelect = (props: CountrySelectProps = {}) => {
  const user = userEvent.setup();
  const view = render(<CountrySelect {...props} />);
  return { user, ...view };
};

const openList = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(countryCombobox());
  return screen.findByRole("dialog");
};

const chipNames = () =>
  Array.from(document.querySelectorAll(".gdy-country-select-chip-label"), (label) => label.textContent);

const limitStatus = () => {
  const status = document.querySelector(".gdy-country-select-status");
  expect(status).toHaveAttribute("role", "status");
  return status;
};

const expectListClosed = () => waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

afterEach(() => vi.restoreAllMocks());

test("the control is found by its default label País and announces a dialog", () => {
  renderCountrySelect();
  const combobox = screen.getByLabelText("País");
  expect(combobox).toBe(countryCombobox());
  expect(combobox).toHaveAttribute("aria-haspopup", "dialog");
  expect(combobox).toHaveAttribute("aria-expanded", "false");
  expect(combobox).toHaveTextContent("Selecciona un país");
});

test("opening sets aria-expanded and names the panel after the label", async () => {
  const { user } = renderCountrySelect();
  const panel = await openList(user);
  expect(countryCombobox()).toHaveAttribute("aria-expanded", "true");
  expect(panel).toHaveAccessibleName("País");
  expect(searchBox()).toHaveFocus();
});

test("searching peru shows Perú, and an ISO code or a dial code finds the country too", async () => {
  const { user } = renderCountrySelect();
  await openList(user);
  await user.type(searchBox(), "peru");
  expect(visibleOptionNames()).toEqual(["Perú"]);
  await user.clear(searchBox());
  await user.type(searchBox(), "uy");
  expect(visibleOptionNames()).toContain("Uruguay");
  await user.clear(searchBox());
  await user.type(searchBox(), "+598");
  expect(visibleOptionNames()).toEqual(["Uruguay"]);
});

test("picking a country closes the list, returns the focus and shows its flag and name", async () => {
  const onValueChange = vi.fn();
  const { user } = renderCountrySelect({ onValueChange });
  await openList(user);
  await user.type(searchBox(), "peru");
  await user.click(option("Perú"));
  await expectListClosed();
  const combobox = countryCombobox();
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith("PE");
  expect(combobox).toHaveFocus();
  expect(combobox).toHaveAttribute("aria-expanded", "false");
  expect(combobox).toHaveAttribute("title", "Perú");
  expect(within(combobox).getByText("Perú")).not.toHaveAttribute("data-placeholder");
  expect(within(combobox).getByRole("presentation")).toHaveAttribute("src", expect.stringContaining("/pe.png"));
});

test("reopening with Uruguay chosen makes it the active option and scrolls it into view", async () => {
  const scrollIntoView = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
  const { user } = renderCountrySelect({ defaultValue: "UY" });
  await openList(user);
  expect(option("Uruguay")).toHaveAttribute("data-active");
  expect(option("Uruguay")).toHaveAttribute("aria-selected", "true");
  expect(searchBox()).toHaveAttribute("aria-activedescendant", option("Uruguay").id);
  expect(scrollIntoView.mock.contexts.at(-1)).toBe(option("Uruguay"));
});

test("Escape closes the list and returns the focus to the combobox", async () => {
  const { user } = renderCountrySelect();
  await openList(user);
  await user.keyboard("{Escape}");
  await expectListClosed();
  expect(countryCombobox()).toHaveFocus();
  expect(countryCombobox()).toHaveAttribute("aria-expanded", "false");
});

test("Enter on the keyboard picks the active country", async () => {
  const onValueChange = vi.fn();
  const { user } = renderCountrySelect({ onValueChange });
  countryCombobox().focus();
  await user.keyboard("{Enter}");
  await screen.findByRole("dialog");
  await user.keyboard("chile{Enter}");
  await expectListClosed();
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith("CL");
});

test("the clear button empties the selection, emits null and keeps the list closed", async () => {
  const onValueChange = vi.fn();
  const { user } = renderCountrySelect({ defaultValue: "PE", onValueChange });
  await user.click(screen.getByRole("button", { name: "Quitar selección" }));
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith(null);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(countryCombobox()).toHaveFocus();
  expect(countryCombobox()).not.toHaveAttribute("title");
  expect(within(countryCombobox()).getByText("Selecciona un país")).toHaveAttribute("data-placeholder");
  expect(screen.queryByRole("button", { name: "Quitar selección" })).not.toBeInTheDocument();
});

test("the clear button and the chevron are siblings of the combobox, never inside it", () => {
  renderCountrySelect({ defaultValue: "PE" });
  const clearButton = screen.getByRole("button", { name: "Quitar selección" });
  expect(countryCombobox()).not.toContainElement(clearButton);
  expect(clearButton.parentElement).toBe(countryCombobox().parentElement);
  const chevron = countryCombobox().parentElement?.querySelector(".gdy-country-select-chevron");
  expect(chevron).toHaveAttribute("aria-hidden", "true");
});

test("choosing the country already chosen only closes the list", async () => {
  const onValueChange = vi.fn();
  const { user } = renderCountrySelect({ defaultValue: "PE", onValueChange });
  await openList(user);
  await user.click(option("Perú"));
  await expectListClosed();
  expect(onValueChange).not.toHaveBeenCalled();
  expect(countryCombobox()).toHaveTextContent("Perú");
});

test("a controlled control shows the app's value until the app changes it", async () => {
  const onValueChange = vi.fn();
  const { user, rerender } = renderCountrySelect({ value: "PE", onValueChange });
  await openList(user);
  await user.click(option("Uruguay"));
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith("UY");
  expect(countryCombobox()).toHaveTextContent("Perú");
  rerender(<CountrySelect value="UY" onValueChange={onValueChange} />);
  expect(countryCombobox()).toHaveTextContent("Uruguay");
  rerender(<CountrySelect value={null} onValueChange={onValueChange} />);
  expect(countryCombobox()).toHaveTextContent("Selecciona un país");
});

test("an uncontrolled control starts on defaultValue and keeps the new choice", async () => {
  const { user } = renderCountrySelect({ defaultValue: "AR" });
  expect(countryCombobox()).toHaveTextContent("Argentina");
  await openList(user);
  await user.click(option("Chile"));
  expect(countryCombobox()).toHaveTextContent("Chile");
});

test("required marks the label and the combobox and removes the clear button", () => {
  renderCountrySelect({ defaultValue: "PE", required: true });
  expect(countryCombobox()).toHaveAttribute("aria-required", "true");
  expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  expect(screen.queryByRole("button", { name: "Quitar selección" })).not.toBeInTheDocument();
});

test("without required the combobox is not marked as required", () => {
  renderCountrySelect();
  expect(countryCombobox()).not.toHaveAttribute("aria-required");
});

test("a required control closed empty shows its own error, only after the list closes", async () => {
  const { user } = renderCountrySelect({ required: true });
  const combobox = countryCombobox();
  expect(combobox).not.toHaveAttribute("aria-invalid");
  await openList(user);
  expect(screen.queryByText("Selecciona un país", { selector: ".gdy-field-error" })).not.toBeInTheDocument();
  await user.keyboard("{Escape}");
  await expectListClosed();
  expect(combobox).toHaveAttribute("aria-invalid", "true");
  expect(combobox).toHaveAccessibleDescription("Selecciona un país");
});

test("choosing a country clears the own error of a required control", async () => {
  const { user } = renderCountrySelect({ required: true });
  await openList(user);
  await user.keyboard("{Escape}");
  await expectListClosed();
  await openList(user);
  await user.click(option("Perú"));
  await expectListClosed();
  expect(countryCombobox()).not.toHaveAttribute("aria-invalid");
});

test("an empty control that is not required shows no error after closing", async () => {
  const { user } = renderCountrySelect();
  await openList(user);
  await user.keyboard("{Escape}");
  await expectListClosed();
  expect(countryCombobox()).not.toHaveAttribute("aria-invalid");
});

test("the app's error always wins over the control's own one", async () => {
  const { user } = renderCountrySelect({ required: true, error: "Elige el país de envío" });
  const combobox = countryCombobox();
  expect(combobox).toHaveAttribute("aria-invalid", "true");
  expect(combobox).toHaveAccessibleDescription("Elige el país de envío");
  await openList(user);
  await user.keyboard("{Escape}");
  await expectListClosed();
  expect(combobox).toHaveAccessibleDescription("Elige el país de envío");
});

test("texts replace the placeholder, the search, the empty list, the clear button and the error", async () => {
  const texts = {
    placeholder: "Choose a country",
    searchLabel: "Search country",
    searchPlaceholder: "Type a name...",
    noResults: "No country found",
    clearSelection: "Clear country",
    required: "Pick a country",
  };
  const { user } = renderCountrySelect({ texts, required: true });
  expect(countryCombobox()).toHaveTextContent("Choose a country");
  await openList(user);
  const search = screen.getByRole("combobox", { name: "Search country" });
  expect(search).toHaveAttribute("placeholder", "Type a name...");
  await user.type(search, "zzz");
  expect(screen.getByRole("status")).toHaveTextContent("No country found");
  await user.keyboard("{Escape}");
  await expectListClosed();
  expect(countryCombobox()).toHaveAccessibleDescription("Pick a country");
});

test("texts.clearSelection names the clear button", () => {
  renderCountrySelect({ defaultValue: "PE", texts: { clearSelection: "Clear country" } });
  expect(screen.getByRole("button", { name: "Clear country" })).toBeInTheDocument();
});

test("a custom label, aria-label and aria-labelledby name the combobox", () => {
  render(
    <>
      <CountrySelect label="País de residencia" />
      <CountrySelect aria-label="País de nacimiento" />
      <span id="destination">País de destino</span>
      <CountrySelect aria-labelledby="destination" />
    </>,
  );
  expect(countryCombobox("País de residencia")).toBeInTheDocument();
  expect(countryCombobox("País de nacimiento")).toBeInTheDocument();
  expect(countryCombobox("País de destino")).toBeInTheDocument();
  expect(screen.queryByText("País")).not.toBeInTheDocument();
});

test('locale="en" shows the country names in English', async () => {
  const { user } = renderCountrySelect({ locale: "en", defaultValue: "PE" });
  expect(countryCombobox()).toHaveTextContent("Peru");
  await openList(user);
  expect(option("Peru")).toHaveAttribute("aria-selected", "true");
});

test("showFlags={false} renders no flag in the combobox nor in the list", async () => {
  const { user } = renderCountrySelect({ showFlags: false, defaultValue: "PE" });
  expect(within(countryCombobox()).queryByRole("presentation")).not.toBeInTheDocument();
  const panel = await openList(user);
  expect(within(panel).queryAllByRole("presentation")).toHaveLength(0);
});

test("flagUrl builds the flag of the combobox and of the options", async () => {
  const flagUrl = vi.fn(() => DATA_FLAG_URL);
  const { user } = renderCountrySelect({ flagUrl, defaultValue: "PE" });
  expect(within(countryCombobox()).getByRole("presentation")).toHaveAttribute("src", DATA_FLAG_URL);
  expect(flagUrl).toHaveBeenCalledWith("PE", 20);
  await openList(user);
  expect(within(option("Uruguay")).getByRole("presentation")).toHaveAttribute("src", DATA_FLAG_URL);
});

test("width writes the width token: a number in px, a string as given", () => {
  const { container } = render(
    <>
      <CountrySelect aria-label="Angosto" width={140} />
      <CountrySelect aria-label="Ancho" width="20rem" />
      <CountrySelect aria-label="Por defecto" />
    </>,
  );
  const frames = container.querySelectorAll<HTMLElement>(".gdy-country-select-frame");
  expect(frames[0].style.getPropertyValue("--gdy-country-select-width")).toBe("140px");
  expect(frames[1].style.getPropertyValue("--gdy-country-select-width")).toBe("20rem");
  expect(frames[2]).not.toHaveAttribute("style");
});

test("className and classNames reach their parts next to the gdy hooks", async () => {
  const classNames = {
    root: "app-root",
    trigger: "app-trigger",
    value: "app-value",
    clear: "app-clear",
    panel: "app-panel",
  };
  const { user } = renderCountrySelect({ defaultValue: "PE", className: "app-select", classNames });
  const combobox = countryCombobox();
  expect(combobox.parentElement).toHaveClass("gdy-scope", "gdy-country-select", "app-select", "app-root");
  expect(combobox).toHaveClass("gdy-country-select-trigger", "app-trigger");
  expect(within(combobox).getByText("Perú")).toHaveClass("gdy-country-select-value", "app-value");
  expect(screen.getByRole("button", { name: "Quitar selección" })).toHaveClass("gdy-country-select-clear", "app-clear");
  expect(await openList(user)).toHaveClass("gdy-floating-panel", "gdy-country-select-panel", "app-panel");
});

test("the value type follows the mode: a code or null in single, an array of codes in multiple", () => {
  expectTypeOf<Parameters<NonNullable<SingleCountrySelectProps["onValueChange"]>>[0]>().toEqualTypeOf<CountryCode | null>();
  expectTypeOf<Parameters<NonNullable<MultipleCountrySelectProps["onValueChange"]>>[0]>().toEqualTypeOf<CountryCode[]>();
  expectTypeOf<MultipleCountrySelectProps["value"]>().toEqualTypeOf<CountryCode[] | undefined>();
});

test("in multiple mode the list stays open and each pick toggles a country, in the order chosen", async () => {
  const onValueChange = vi.fn();
  const { user } = renderCountrySelect({ multiple: true, onValueChange });
  await openList(user);
  expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
  await user.click(option("Uruguay"));
  await user.click(option("Perú"));
  await user.click(option("Uruguay"));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(onValueChange.mock.calls).toEqual([[["UY"]], [["UY", "PE"]], [["PE"]]]);
  expect(chipNames()).toEqual(["Perú"]);
});

test("in multiple mode Enter picks several countries with the list open", async () => {
  const onValueChange = vi.fn();
  const { user } = renderCountrySelect({ multiple: true, onValueChange });
  await openList(user);
  await user.keyboard("chile{Enter}");
  await user.clear(searchBox());
  await user.keyboard("peru{Enter}");
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(searchBox()).toHaveFocus();
  expect(onValueChange).toHaveBeenLastCalledWith(["CL", "PE"]);
  expect(option("Perú")).toHaveAttribute("aria-selected", "true");
});

test("a controlled multiple value is never mutated: every change emits a new array", async () => {
  const value = Object.freeze(["PE"]) as CountryCode[];
  const onValueChange = vi.fn();
  const { user } = renderCountrySelect({ multiple: true, value, onValueChange });
  await openList(user);
  await user.click(option("Chile"));
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith(["PE", "CL"]);
  expect(value).toEqual(["PE"]);
});

test("at the maximum the other countries are disabled and a status says why; removing one enables them again", async () => {
  const { user } = renderCountrySelect({ multiple: true, maxSelected: 2, defaultValue: ["PE"] });
  await openList(user);
  expect(limitStatus()).toBeEmptyDOMElement();
  await user.click(option("Chile"));
  expect(option("Uruguay")).toHaveAttribute("aria-disabled", "true");
  expect(option("Perú")).not.toHaveAttribute("aria-disabled");
  expect(limitStatus()).toHaveTextContent("Alcanzaste el máximo permitido (2)");
  await user.click(option("Uruguay"));
  expect(chipNames()).toEqual(["Perú", "Chile"]);
  await user.click(option("Chile"));
  expect(option("Uruguay")).not.toHaveAttribute("aria-disabled");
  expect(limitStatus()).toBeEmptyDOMElement();
});

test("texts.maxReached replaces the limit message", async () => {
  const texts = { maxReached: "Hasta {max} países" };
  const { user } = renderCountrySelect({ multiple: true, maxSelected: 1, defaultValue: ["PE"], texts });
  await openList(user);
  expect(limitStatus()).toHaveTextContent("Hasta 1 países");
});

test("a selection below the minimum shows its error once the list closes", async () => {
  const { user } = renderCountrySelect({ multiple: true, minSelected: 2 });
  await openList(user);
  await user.click(option("Perú"));
  expect(countryCombobox()).not.toHaveAttribute("aria-invalid");
  await user.keyboard("{Escape}");
  await expectListClosed();
  expect(countryCombobox()).toHaveAttribute("aria-invalid", "true");
  expect(countryCombobox()).toHaveAccessibleDescription("Selecciona al menos 2 países");
});

test("texts.belowMinimum replaces the minimum error, and an empty selection is not below it", async () => {
  const texts = { belowMinimum: "Mínimo {min}" };
  const { user } = renderCountrySelect({ multiple: true, minSelected: 3, defaultValue: ["PE"], texts });
  await openList(user);
  await user.keyboard("{Escape}");
  await expectListClosed();
  expect(countryCombobox()).toHaveAccessibleDescription("Mínimo 3");
  await openList(user);
  await user.click(option("Perú"));
  await user.keyboard("{Escape}");
  await expectListClosed();
  expect(countryCombobox()).not.toHaveAttribute("aria-invalid");
});

test("a required multiple control closed empty shows the required error", async () => {
  const { user } = renderCountrySelect({ multiple: true, required: true });
  await openList(user);
  await user.keyboard("{Escape}");
  await expectListClosed();
  expect(countryCombobox()).toHaveAccessibleDescription("Selecciona un país");
});

test("a chip's remove button takes out only that country, without opening the list, and marks the control touched", async () => {
  const onValueChange = vi.fn();
  const { user } = renderCountrySelect({ multiple: true, minSelected: 2, defaultValue: ["PE", "UY", "CL"], onValueChange });
  await user.click(screen.getByRole("button", { name: "Quitar Uruguay" }));
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith(["PE", "CL"]);
  expect(chipNames()).toEqual(["Perú", "Chile"]);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(countryCombobox()).toHaveFocus();
  expect(countryCombobox()).not.toHaveAttribute("aria-invalid");
  await user.click(screen.getByRole("button", { name: "Quitar Chile" }));
  expect(countryCombobox()).toHaveAccessibleDescription("Selecciona al menos 2 países");
});

test("in multiple mode the combobox reads a summary, or the multiple placeholder, and there is no clear button", () => {
  const { rerender } = renderCountrySelect({ multiple: true, defaultValue: ["PE", "UY"] });
  expect(countryCombobox()).toHaveTextContent("Países seleccionados: 2");
  expect(countryCombobox()).toHaveAttribute("title", "Perú, Uruguay");
  expect(screen.queryByRole("button", { name: "Quitar selección" })).not.toBeInTheDocument();
  expect(screen.getByRole("list")).not.toContainElement(countryCombobox());
  rerender(<CountrySelect multiple value={[]} />);
  expect(within(countryCombobox()).getByText("Selecciona países")).toHaveAttribute("data-placeholder");
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("the chips show flag and name and read their texts from texts", () => {
  const texts = { removeCountry: "Remove {country}", selectedCountries: "{count} selected" };
  renderCountrySelect({ multiple: true, defaultValue: ["PE"], texts, flagUrl: () => DATA_FLAG_URL });
  const chip = within(screen.getByRole("list")).getByTitle("Perú");
  expect(within(chip).getByRole("presentation")).toHaveAttribute("src", DATA_FLAG_URL);
  expect(within(chip).getByRole("button", { name: "Remove Perú" })).toBeInTheDocument();
  expect(countryCombobox()).toHaveTextContent("1 selected");
});

test("classNames.chips and classNames.chip reach the chip row", () => {
  renderCountrySelect({ multiple: true, defaultValue: ["PE"], classNames: { chips: "app-chips", chip: "app-chip" } });
  expect(screen.getByRole("list")).toHaveClass("gdy-country-select-chips", "app-chips");
  expect(within(screen.getByRole("list")).getByTitle("Perú")).toHaveClass("gdy-country-select-chip", "app-chip");
});

test("a minimum above the maximum throws InvalidSelectionRangeError on render", () => {
  expectRenderError(<CountrySelect multiple minSelected={3} maxSelected={2} />, InvalidSelectionRangeError);
});
