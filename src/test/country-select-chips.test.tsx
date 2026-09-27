import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { DEFAULT_COUNTRY_SELECT_TEXTS } from "../components/country-select/constants";
import { CountryChips } from "../components/country-select/parts/CountryChips";
import { SelectionLimitStatus } from "../components/country-select/parts/SelectionLimitStatus";
import type { CountryFlagSettings } from "../components/shared/countries/country-flag-url";
import type { Country } from "../components/shared/countries/country-list";

const PERU: Country = { code: "PE", name: "Perú" };
const CHILE: Country = { code: "CL", name: "Chile" };
const MEXICO: Country = { code: "MX", name: "México" };
const SOUTH_GEORGIA: Country = { code: "GS", name: "Islas Georgias del Sur y Sandwich del Sur" };

const TEST_FLAG_SETTINGS: CountryFlagSettings = {
  visible: true,
  resolveUrl: (code, width) => `/flags/${code}-${width}.svg`,
};

const buildChips = (countries: readonly Country[], onRemove: () => void) => (
  <CountryChips
    countries={countries}
    flagSettings={TEST_FLAG_SETTINGS}
    texts={DEFAULT_COUNTRY_SELECT_TEXTS}
    onRemove={onRemove}
    classNames={{ chips: "app-chips", chip: "app-chip" }}
  />
);

const renderChips = (countries: readonly Country[]) => {
  const onRemove = vi.fn();
  const view = render(buildChips(countries, onRemove));
  const rerenderChips = (nextCountries: readonly Country[]) => view.rerender(buildChips(nextCountries, onRemove));
  return { ...view, onRemove, rerenderChips };
};

// jsdom lays nothing out: a row 100px wide, chips of 60px and a badge of 30px stand in for the browser.
const stubWidthOf = (element: HTMLElement): number => {
  if (element.matches("ul")) return 100;
  return element.matches("[data-more-badge]") ? 30 : 60;
};

const stubChipRowWidths = () => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    return DOMRect.fromRect({ width: stubWidthOf(this), height: 24 });
  });
};

// Chips as wide as their name is long: two short ones fit the 100px row, a short and a long one do not.
const stubWidthsByName = () => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    if (this.matches("ul")) return DOMRect.fromRect({ width: 100, height: 24 });
    if (this.matches("[data-more-badge]")) return DOMRect.fromRect({ width: 30, height: 24 });
    return DOMRect.fromRect({ width: this.title.length > 10 ? 80 : 40, height: 24 });
  });
};

afterEach(() => {
  vi.restoreAllMocks();
});

test("each chip shows its flag and name, with the full name as its title and the consumer's classes", () => {
  renderChips([PERU, CHILE]);
  const peruChip = screen.getByTitle("Perú");
  expect(peruChip).toHaveTextContent("Perú");
  expect(peruChip).toHaveClass("gdy-country-select-chip", "app-chip");
  expect(peruChip.querySelector("img")).toHaveAttribute("src", "/flags/PE-20.svg");
  expect(screen.getByRole("list")).toHaveClass("gdy-country-select-chips", "app-chips");
});

test("the remove button of a chip removes only that country, once", async () => {
  const user = userEvent.setup();
  const { onRemove } = renderChips([PERU, CHILE]);
  await user.click(screen.getByRole("button", { name: "Quitar Perú" }));
  expect(onRemove).toHaveBeenCalledTimes(1);
  expect(onRemove).toHaveBeenCalledWith("PE", screen.getByRole("button", { name: "Quitar Perú" }));
});

test("the +N badge stays hidden while every chip is visible", () => {
  const { container } = renderChips([PERU, CHILE]);
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(container.querySelector("[data-more-badge]")).not.toBeVisible();
  expect(screen.queryByRole("listitem", { name: / más$/ })).toBeNull();
});

test("chips that do not fit are hidden and the +N badge names how many are left out", () => {
  stubChipRowWidths();
  renderChips([PERU, CHILE, MEXICO]);
  const list = screen.getByRole("list");
  expect(within(list).getByTitle("Perú")).toBeVisible();
  expect(within(list).queryByRole("button", { name: "Quitar Chile" })).toBeNull();
  expect(screen.getByRole("listitem", { name: "2 más" })).toHaveTextContent("+2");
});

test("the limit status is always a status region, and shows or clears its message", () => {
  const { rerender } = render(<SelectionLimitStatus message="Alcanzaste el máximo permitido (3)" />);
  expect(screen.getByRole("status")).toHaveTextContent("Alcanzaste el máximo permitido (3)");
  rerender(<SelectionLimitStatus message={null} />);
  expect(screen.getByRole("status")).toBeEmptyDOMElement();
});

test("swapping a country for another, with the same count, measures the row again", () => {
  stubWidthsByName();
  const { rerenderChips } = renderChips([PERU, CHILE]);
  expect(screen.getByTitle("Chile")).toBeVisible();
  rerenderChips([PERU, SOUTH_GEORGIA]);
  expect(screen.getByTitle(SOUTH_GEORGIA.name)).not.toBeVisible();
  expect(screen.getByRole("listitem", { name: "1 más" })).toHaveTextContent("+1");
});
