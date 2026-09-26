import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import type { AccessibleName } from "../components/shared/accessible-name";
import { Listbox } from "../components/shared/listbox/Listbox";
import type { ListboxOption, ListboxProps } from "../components/shared/listbox/listbox-props";

type ListboxOverrides = Partial<Omit<ListboxProps, keyof AccessibleName>>;

const COUNTRY_OPTIONS: ListboxOption[] = [
  { value: "AR", label: "Argentina" },
  { value: "MX", label: "México" },
  { value: "PE", label: "Perú" },
  { value: "GB", label: "Reino Unido", searchTerms: ["GB"] },
  { value: "UY", label: "Uruguay" },
];

const COUNTRY_LIST_NAME: AccessibleName = { "aria-label": "Países" };

const PERU_WITH_FLAG_AND_PREFIX: ListboxOption = {
  value: "PE",
  label: "Perú",
  leading: <img alt="" src="data:," />,
  trailing: "+51",
};

const renderListbox = (
  overrides: ListboxOverrides = {},
  accessibleName: AccessibleName = COUNTRY_LIST_NAME,
) => {
  const onSelect = vi.fn();
  const user = userEvent.setup();
  render(
    <Listbox
      {...accessibleName}
      options={COUNTRY_OPTIONS}
      selectedValues={[]}
      onSelect={onSelect}
      {...overrides}
    />,
  );
  return { onSelect, user };
};

const disableOptions = (...values: string[]) =>
  COUNTRY_OPTIONS.map((option) => ({ ...option, disabled: values.includes(option.value) }));

const searchBox = () => screen.getByRole("combobox", { name: "Buscar" });

const option = (name: string) => screen.getByRole("option", { name });

const visibleOptionNames = () =>
  screen.queryAllByRole("option").map((element) => element.textContent);

const expectActiveOption = (name: string) => {
  expect(searchBox()).toHaveAttribute("aria-activedescendant", option(name).id);
  expect(option(name)).toHaveAttribute("data-active");
};

const toggleValue = (values: string[], value: string) =>
  values.includes(value)
    ? values.filter((selectedValue) => selectedValue !== value)
    : [...values, value];

const MultipleListbox = ({ onSelect }: { onSelect: (value: string) => void }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const selectValue = (value: string) => {
    onSelect(value);
    setSelectedValues((current) => toggleValue(current, value));
  };
  return (
    <Listbox
      {...COUNTRY_LIST_NAME}
      options={COUNTRY_OPTIONS}
      selectedValues={selectedValues}
      onSelect={selectValue}
      multiple
    />
  );
};

afterEach(() => vi.restoreAllMocks());

test("aria-label names the listbox", () => {
  renderListbox({}, { "aria-label": "Países de origen" });
  expect(screen.getByRole("listbox", { name: "Países de origen" })).toBeInTheDocument();
});

test("aria-labelledby names the listbox after the element it references", () => {
  render(<h2 id="destination-heading">Países de destino</h2>);
  renderListbox({}, { "aria-labelledby": "destination-heading" });
  expect(screen.getByRole("listbox", { name: "Países de destino" })).toBeInTheDocument();
});

test("the search box takes the focus on mount and controls the listbox", () => {
  renderListbox();
  expect(searchBox()).toHaveFocus();
  expect(searchBox()).toHaveAttribute("aria-controls", screen.getByRole("listbox").id);
  expect(searchBox()).toHaveAttribute("aria-expanded", "true");
  expect(searchBox()).toHaveAttribute("aria-autocomplete", "list");
  expect(searchBox()).toHaveAttribute("placeholder", "Buscar...");
});

test("the search filters ignoring accents and case", async () => {
  const { user } = renderListbox();
  await user.type(searchBox(), "MEXICO");
  expect(visibleOptionNames()).toEqual(["México"]);
  await user.clear(searchBox());
  await user.type(searchBox(), " peru ");
  expect(visibleOptionNames()).toEqual(["Perú"]);
});

test("searchTerms find an option whose label does not contain the query", async () => {
  const { user } = renderListbox();
  await user.type(searchBox(), "gb");
  expect(visibleOptionNames()).toEqual(["Reino Unido"]);
});

test("a custom matchesQuery replaces the default filter", async () => {
  const { user } = renderListbox({
    matchesQuery: (candidate, query) => candidate.value === query.toUpperCase(),
  });
  await user.type(searchBox(), "mx");
  expect(visibleOptionNames()).toEqual(["México"]);
});

test("options carry role option and aria-selected, in a single-select listbox", () => {
  renderListbox({ selectedValues: ["PE"] });
  expect(screen.getByRole("listbox")).not.toHaveAttribute("aria-multiselectable");
  expect(option("Perú")).toHaveAttribute("aria-selected", "true");
  expect(option("Argentina")).toHaveAttribute("aria-selected", "false");
});

test("arrows, Home and End move the active option up to the edges without leaving the search box", async () => {
  const { user } = renderListbox();
  expectActiveOption("Argentina");
  await user.keyboard("{ArrowDown}");
  expectActiveOption("México");
  await user.keyboard("{ArrowUp}{ArrowUp}");
  expectActiveOption("Argentina");
  await user.keyboard("{End}{ArrowDown}");
  expectActiveOption("Uruguay");
  await user.keyboard("{Home}");
  expectActiveOption("Argentina");
  expect(searchBox()).toHaveFocus();
});

test("Enter picks the active option", async () => {
  const { onSelect, user } = renderListbox();
  await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
  expect(onSelect).toHaveBeenCalledExactlyOnceWith("PE");
  expect(searchBox()).toHaveFocus();
});

test("a new search makes the first result active and keeps the option ids", async () => {
  const { user } = renderListbox();
  const uruguayId = option("Uruguay").id;
  await user.type(searchBox(), "u");
  expectActiveOption("Perú");
  await user.type(searchBox(), "r");
  expectActiveOption("Uruguay");
  expect(option("Uruguay").id).toBe(uruguayId);
});

test("opening with a selected value makes it active and scrolls it into view", () => {
  const scrollIntoView = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
  renderListbox({ selectedValues: ["UY"] });
  expectActiveOption("Uruguay");
  expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
  expect(scrollIntoView.mock.contexts.at(-1)).toBe(option("Uruguay"));
});

test("the active option is scrolled into view on every move", async () => {
  const scrollIntoView = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
  const { user } = renderListbox({ selectedValues: ["UY"] });
  await user.keyboard("{ArrowUp}");
  expect(scrollIntoView.mock.contexts.at(-1)).toBe(option("Reino Unido"));
});

test("a disabled option is skipped by the arrows and picked neither by Enter nor by a click", async () => {
  const { onSelect, user } = renderListbox({ options: disableOptions("MX") });
  expect(option("México")).toHaveAttribute("aria-disabled", "true");
  await user.keyboard("{ArrowDown}");
  expectActiveOption("Perú");
  await user.click(option("México"));
  await user.type(searchBox(), "mexico{Enter}");
  expect(searchBox()).not.toHaveAttribute("aria-activedescendant");
  expect(onSelect).not.toHaveBeenCalled();
});

test("the first active option and Home and End skip disabled options at the edges", async () => {
  const { user } = renderListbox({ options: disableOptions("AR", "UY") });
  expectActiveOption("México");
  await user.keyboard("{End}");
  expectActiveOption("Reino Unido");
  await user.keyboard("{Home}");
  expectActiveOption("México");
});

test("the pointer makes the option under it active, never a disabled one, and the arrows go on from it", async () => {
  const { user } = renderListbox({ options: disableOptions("MX") });
  await user.hover(option("Perú"));
  expectActiveOption("Perú");
  await user.hover(option("México"));
  expectActiveOption("Perú");
  await user.keyboard("{ArrowDown}");
  expectActiveOption("Reino Unido");
});

test("an option made active by the pointer is not scrolled, since it is already in view", async () => {
  const scrollIntoView = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
  const { user } = renderListbox();
  scrollIntoView.mockClear();
  await user.hover(option("Perú"));
  expectActiveOption("Perú");
  expect(scrollIntoView).not.toHaveBeenCalled();
});

test("a click picks the option and keeps the focus in the search box", async () => {
  const { onSelect, user } = renderListbox();
  await user.click(option("Perú"));
  expect(onSelect).toHaveBeenCalledExactlyOnceWith("PE");
  expect(searchBox()).toHaveFocus();
});

test("in multiple mode the listbox is multiselectable and Enter toggles several options", async () => {
  const onSelect = vi.fn();
  const user = userEvent.setup();
  render(<MultipleListbox onSelect={onSelect} />);
  expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
  await user.keyboard("{Enter}{ArrowDown}{Enter}");
  expect(onSelect.mock.calls).toEqual([["AR"], ["MX"]]);
  expect(option("Argentina")).toHaveAttribute("aria-selected", "true");
  expect(option("México")).toHaveAttribute("aria-selected", "true");
  await user.keyboard("{Enter}");
  expect(option("México")).toHaveAttribute("aria-selected", "false");
  expect(searchBox()).toHaveFocus();
});

test("an option shows its leading content and its trailing text", () => {
  renderListbox({ options: [PERU_WITH_FLAG_AND_PREFIX] });
  const peru = screen.getByRole("option");
  expect(within(peru).getByRole("presentation")).toBeInTheDocument();
  expect(within(peru).getByText("+51")).toBeInTheDocument();
});

test("the label carries a title with the full text", () => {
  const label = "Islas Georgias del Sur y Sandwich del Sur (territorio británico de ultramar)";
  renderListbox({ options: [{ value: "GS", label }] });
  expect(screen.getByTitle(label)).toHaveClass("gdy-listbox-label");
});

test("with no results the status says Sin resultados", async () => {
  const { user } = renderListbox();
  expect(screen.getByRole("status")).toBeEmptyDOMElement();
  await user.type(searchBox(), "zzz");
  expect(visibleOptionNames()).toEqual([]);
  expect(screen.getByRole("status")).toHaveTextContent("Sin resultados");
});

test("texts.noResults replaces the no-results message", async () => {
  const { user } = renderListbox({ texts: { noResults: "Ningún país coincide" } });
  await user.type(searchBox(), "zzz");
  expect(screen.getByRole("status")).toHaveTextContent("Ningún país coincide");
});

test("scrollbarColor reaches the root as --gdy-scrollbar-thumb, with thin scrollbars by default", () => {
  renderListbox({ scrollbarColor: "tomato" });
  const listbox = screen.getByRole("listbox");
  expect(listbox).toHaveClass("gdy-scroll");
  const root = listbox.closest<HTMLElement>(".gdy-listbox");
  expect(root).toHaveClass("gdy-thin-scroll");
  expect(root?.style.getPropertyValue("--gdy-scrollbar-thumb")).toBe("tomato");
});

test("thinScrollbars false drops the thin scrollbar classes", () => {
  renderListbox({ thinScrollbars: false });
  const listbox = screen.getByRole("listbox");
  expect(listbox).not.toHaveClass("gdy-scroll");
  expect(listbox.closest(".gdy-listbox")).not.toHaveClass("gdy-thin-scroll");
});
