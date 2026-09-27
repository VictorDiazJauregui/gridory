import type { CSSProperties, ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { CountrySelect } from "../components/country-select";
import type { CountryCode, MultipleCountrySelectProps, SingleCountrySelectProps } from "../components/country-select";
import { FLOATING_PANEL_PLACEMENT } from "../components/shared/floating-panel/floating-panel-placement";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, applyTheme } from "./browser/environment";
import type { ScreenName, Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";

interface Scenario {
  theme: Theme;
  screen: ScreenName;
}

type SelectOverrides = Partial<Omit<SingleCountrySelectProps, "multiple">>;

type MultipleOverrides = Omit<MultipleCountrySelectProps, "multiple">;

const SCENARIOS: Scenario[] = [
  { theme: "light", screen: "desktop" },
  { theme: "dark", screen: "desktop" },
  { theme: "light", screen: "iphone14Pro" },
  { theme: "dark", screen: "iphone14Pro" },
];

// The tests never wait on flagcdn: every flag is a local one-pixel image.
const LOCAL_FLAG_URL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const PANEL_MIN_WIDTH = 240;
const WIDE_FIELD_WIDTH = 320;
const NARROW_FIELD_WIDTH = 140;
const NARROW_CONTAINER_WIDTH = 120;
// "Islas Georgias del Sur y Sandwich del Sur": longer than any narrow box.
const LONG_NAME_COUNTRY = "GS";
const THUMB_COLOR = "rgb(255, 99, 71)";
const TRANSPARENT = "rgba(0, 0, 0, 0)";
// Each name is longer than the chip's maximum width, so every chip takes 8rem.
const LONG_NAME_COUNTRIES: CountryCode[] = ["GS", "VC", "CF"];
const WIDER_FIELD_WIDTH = 400;
// Label plus box, and the room left under them: less than the panel needs.
const FIELD_HEIGHT = 66;
const ROOM_BELOW_FIELD = 24;

const resolveLocalFlag = () => LOCAL_FLAG_URL;

const applyScenario = async ({ theme, screen: screenName }: Scenario) => {
  applyTheme(theme);
  await applyScreen(screenName);
};

const renderCountrySelect = (overrides: SelectOverrides = {}, wrapperStyle: CSSProperties = {}) =>
  render(
    <div data-testid="wrapper" style={wrapperStyle}>
      <CountrySelect flagUrl={resolveLocalFlag} {...overrides} />
    </div>,
  );

const renderInScroller = (content: ReactNode, scrollerStyle: CSSProperties) =>
  render(
    <div data-testid="scroller" style={{ overflowY: "auto", ...scrollerStyle }}>
      {content}
    </div>,
  );

const renderMultiple = (overrides: MultipleOverrides) => {
  const { rerender } = render(<CountrySelect multiple flagUrl={resolveLocalFlag} {...overrides} />);
  return (nextOverrides: MultipleOverrides) =>
    rerender(<CountrySelect multiple flagUrl={resolveLocalFlag} {...nextOverrides} />);
};

const findMoreBadge = () => findRequiredElement(findBox(), "[data-more-badge]") as HTMLElement;

// Read from the badge: "+N" while some chips are hidden, nothing to count otherwise.
const countHiddenChips = (): number => (findMoreBadge().hidden ? 0 : Number(findMoreBadge().textContent));

const listVisibleChips = () => Array.from(findBox().querySelectorAll<HTMLElement>("[data-chip]:not([hidden])"));

const combobox = () => screen.getByRole("combobox", { name: "País" });

const findBox = () => findRequiredElement(document.body, ".gdy-country-select");

const findPanel = () => findRequiredElement(document.body, ".gdy-country-select-panel");

const openList = async () => {
  await userEvent.click(combobox());
  return screen.findByRole("dialog", { name: "País" });
};

const measureGapToBox = () => {
  const panel = measureBox(findPanel());
  const box = measureBox(findBox());
  return findPanel().getAttribute("data-side") === "top" ? box.top - panel.bottom : panel.top - box.bottom;
};

// Floating UI places the panel a frame later and the opening animation scales
// it, so layout assertions wait until it rests at its offset and full size.
const waitUntilPanelRests = () => expect.poll(measureGapToBox).toBe(FLOATING_PANEL_PLACEMENT.sideOffset);

const isWithinViewport = (element: Element): boolean => {
  const { top, right, bottom, left } = measureBox(element);
  return top >= 0 && left >= 0 && bottom <= window.innerHeight && right <= window.innerWidth;
};

const isWithinVertically = (inner: Element, outer: Element): boolean => {
  const innerBox = measureBox(inner);
  const outerBox = measureBox(outer);
  return innerBox.top >= outerBox.top && innerBox.bottom <= outerBox.bottom;
};

const isWithinHorizontally = (inner: Element, outer: Element): boolean => {
  const innerBox = measureBox(inner);
  const outerBox = measureBox(outer);
  return innerBox.left >= outerBox.left && innerBox.right <= outerBox.right;
};

const splitShadowLayers = (boxShadow: string): string[] => boxShadow.split(/,(?![^(]*\))/);

// Set through the CSSOM: a React style object would need camelCase keys.
const renderColorReference = (value: string) => {
  const { container } = render(<span />);
  const reference = findRequiredElement(container, "span") as HTMLElement;
  reference.style.setProperty("color", value);
  return readStyle(reference, "color");
};

test.each(SCENARIOS)("keyboard focus is an inset ring over the whole box, which keeps its size ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderCountrySelect({ defaultValue: "PE" });
  const boxBefore = measureBox(findBox());
  await userEvent.tab();
  expect(combobox()).toHaveFocus();
  expect(combobox().matches(":focus-visible")).toBe(true);
  const ringLayers = splitShadowLayers(readStyle(combobox(), "box-shadow", "::before"));
  expect(ringLayers.every((layer) => layer.trim().endsWith("inset"))).toBe(true);
  expect(readStyle(combobox(), "outline-style")).toBe("none");
  expect(measureBox(findBox())).toEqual(boxBefore);
});

test.each(SCENARIOS)("near the bottom edge the panel opens above and moves below once scrolled up ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  const spaceAboveField = window.innerHeight - FIELD_HEIGHT - ROOM_BELOW_FIELD;
  renderInScroller(
    <>
      <div style={{ height: spaceAboveField }} />
      <CountrySelect flagUrl={resolveLocalFlag} defaultValue="PE" />
      <div style={{ height: 2 * window.innerHeight }} />
    </>,
    { height: window.innerHeight },
  );
  await openList();
  await waitUntilPanelRests();
  expect(findPanel()).toHaveAttribute("data-side", "top");
  screen.getByTestId("scroller").scrollTop = spaceAboveField;
  await expect.poll(() => findPanel().getAttribute("data-side")).toBe("bottom");
  await waitUntilPanelRests();
});

test.each(SCENARIOS)("inside a scrolling container the panel fits on screen ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderInScroller(
    <>
      <div style={{ height: 120 }} />
      <CountrySelect flagUrl={resolveLocalFlag} />
      <div style={{ height: 600 }} />
    </>,
    { height: 300 },
  );
  await openList();
  await waitUntilPanelRests();
  expect(isWithinViewport(findPanel())).toBe(true);
});

test.each(SCENARIOS)("the panel is at least 240px and never narrower than the box ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderCountrySelect({ width: NARROW_FIELD_WIDTH });
  await openList();
  await waitUntilPanelRests();
  await expect.poll(() => measureBox(findPanel()).width).toBe(PANEL_MIN_WIDTH);
});

test.each(SCENARIOS)("a box wider than 240px gets a panel as wide as itself ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderCountrySelect({ width: WIDE_FIELD_WIDTH });
  await openList();
  await waitUntilPanelRests();
  expect(measureBox(findBox()).width).toBe(WIDE_FIELD_WIDTH);
  await expect.poll(() => measureBox(findPanel()).width).toBe(WIDE_FIELD_WIDTH);
});

test.each(SCENARIOS)("with Uruguay chosen, its option opens inside the visible area of the list ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderCountrySelect({ defaultValue: "UY" });
  await openList();
  await waitUntilPanelRests();
  const list = screen.getByRole("listbox", { name: "País" });
  expect(list.scrollTop).toBeGreaterThan(0);
  await expect.poll(() => isWithinVertically(screen.getByRole("option", { name: "Uruguay" }), list)).toBe(true);
});

test.each(SCENARIOS)("the list scrolls with a thin scrollbar in the token color ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderCountrySelect();
  await openList();
  const list = screen.getByRole("listbox", { name: "País" });
  const thumbColor = renderColorReference("var(--gdy-scrollbar-thumb, var(--gdy-input))");
  expect(readStyle(list, "scrollbar-width")).toBe("thin");
  expect(readStyle(list, "scrollbar-color")).toBe(`${thumbColor} ${TRANSPARENT}`);
});

test.each(SCENARIOS)("width={140} truncates a long name inside a 140px box ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderCountrySelect({ width: NARROW_FIELD_WIDTH, defaultValue: LONG_NAME_COUNTRY });
  const value = findRequiredElement(combobox(), ".gdy-country-select-value");
  expect(measureBox(findBox()).width).toBe(NARROW_FIELD_WIDTH);
  expect(value.scrollWidth).toBeGreaterThan(value.clientWidth);
  expect(readStyle(value, "text-overflow")).toBe("ellipsis");
});

test.each(SCENARIOS)("in a 120px container the box shrinks instead of overflowing ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderCountrySelect({ defaultValue: LONG_NAME_COUNTRY }, { width: NARROW_CONTAINER_WIDTH });
  expect(isWithinHorizontally(findBox(), screen.getByTestId("wrapper"))).toBe(true);
  expect(measureBox(findBox()).width).toBe(NARROW_CONTAINER_WIDTH);
});

// Apps lay fields out in flex rows: as a flex item the control shrinks with the row instead of overflowing it.
test.each(SCENARIOS)("as the item of a 120px flex row the box shrinks instead of overflowing ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderCountrySelect({ defaultValue: LONG_NAME_COUNTRY }, { display: "flex", width: NARROW_CONTAINER_WIDTH });
  expect(isWithinHorizontally(findBox(), screen.getByTestId("wrapper"))).toBe(true);
  expect(measureBox(findBox()).width).toBe(NARROW_CONTAINER_WIDTH);
});

test("scrollbarColor paints the thumb of the list", async () => {
  renderCountrySelect({ scrollbarColor: THUMB_COLOR });
  await openList();
  expect(readStyle(screen.getByRole("listbox", { name: "País" }), "scrollbar-color")).toBe(`${THUMB_COLOR} ${TRANSPARENT}`);
});

test("a click on the chevron opens the list and a click on the clear button does not", async () => {
  renderCountrySelect({ defaultValue: "PE" });
  await userEvent.click(screen.getByRole("button", { name: "Quitar selección" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await userEvent.click(findRequiredElement(findBox(), ".gdy-country-select-chevron"), { force: true });
  expect(await screen.findByRole("dialog", { name: "País" })).toBeInTheDocument();
});

test("the chevron turns while the list is open", async () => {
  renderCountrySelect();
  const chevron = findRequiredElement(findBox(), ".gdy-country-select-chevron");
  expect(readStyle(chevron, "transform")).toBe("none");
  await openList();
  expect(readStyle(chevron, "transform")).not.toBe("none");
});

test("an error paints the box border with the destructive token", () => {
  renderCountrySelect({ error: "Elige un país" });
  const destructive = renderColorReference("var(--gdy-destructive)");
  expect(readStyle(combobox(), "border-top-color", "::before")).toBe(destructive);
});

test.each(SCENARIOS)("three long names in 240px show +N, and no chip leaves the box ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderMultiple({ defaultValue: LONG_NAME_COUNTRIES });
  await expect.poll(countHiddenChips).toBeGreaterThan(0);
  expect(listVisibleChips().length + countHiddenChips()).toBe(LONG_NAME_COUNTRIES.length);
  for (const rowItem of [...listVisibleChips(), findMoreBadge()]) {
    expect(isWithinHorizontally(rowItem, findBox())).toBe(true);
  }
});

test.each(SCENARIOS)("a wider box fits more chips and the +N goes down ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  const rerenderMultiple = renderMultiple({ defaultValue: LONG_NAME_COUNTRIES });
  await expect.poll(countHiddenChips).toBeGreaterThan(0);
  const hiddenAtDefaultWidth = countHiddenChips();
  rerenderMultiple({ defaultValue: LONG_NAME_COUNTRIES, width: WIDER_FIELD_WIDTH });
  await expect.poll(countHiddenChips).toBeLessThan(hiddenAtDefaultWidth);
  expect(listVisibleChips().length).toBeGreaterThan(LONG_NAME_COUNTRIES.length - hiddenAtDefaultWidth);
});

test("a click on a chip opens the list, and a click on its remove button does not", async () => {
  renderMultiple({ defaultValue: ["PE", "UY"] });
  await userEvent.click(screen.getByRole("button", { name: "Quitar Uruguay" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(combobox()).toHaveFocus();
  await userEvent.click(within(screen.getByRole("list")).getByTitle("Perú"), { force: true });
  expect(await screen.findByRole("dialog", { name: "País" })).toBeInTheDocument();
});

test("chips keep the box as tall as the single one", () => {
  render(
    <>
      <CountrySelect aria-label="Simple" flagUrl={resolveLocalFlag} defaultValue="PE" />
      <CountrySelect aria-label="Múltiple" multiple flagUrl={resolveLocalFlag} defaultValue={LONG_NAME_COUNTRIES} />
    </>,
  );
  const [singleBox, multipleBox] = Array.from(document.querySelectorAll(".gdy-country-select"), measureBox);
  expect(multipleBox.height).toBe(singleBox.height);
});
