import type { CSSProperties } from "react";
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { SegmentedControl } from "../components/segmented-control";
import type { SegmentedControlProps } from "../components/segmented-control";
import { CALENDAR_VIEW_OPTIONS } from "../components/mocks/controls/segmented/segmented-options";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, applyTheme } from "./browser/environment";
import type { ScreenName, Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";

interface Scenario {
  theme: Theme;
  screen: ScreenName;
}

type CalendarViewOverrides = Partial<Pick<SegmentedControlProps, "animated" | "defaultValue">>;

const SCENARIOS: Scenario[] = [
  { theme: "light", screen: "desktop" },
  { theme: "dark", screen: "desktop" },
  { theme: "light", screen: "iphone14Pro" },
  { theme: "dark", screen: "iphone14Pro" },
];

const BOX_EDGES = ["left", "top", "width", "height"] as const;
const TRANSPARENT = "rgba(0, 0, 0, 0)";
// Narrower than the four options together, so the root has to scroll them.
const NARROW_CONTAINER_WIDTH = 166;
// Offsets are whole pixels and an option can be a fractional width.
const ROUNDING_TOLERANCE_PX = 1;

const applyScenario = async ({ theme, screen: screenName }: Scenario) => {
  applyTheme(theme);
  await applyScreen(screenName);
};

const renderCalendarView = (wrapperStyle: CSSProperties = {}, overrides: CalendarViewOverrides = {}) => {
  const { container } = render(
    <div data-testid="wrapper" style={wrapperStyle}>
      <SegmentedControl aria-label="Vista del calendario" options={CALENDAR_VIEW_OPTIONS} defaultValue="month" {...overrides} />
    </div>,
  );
  return within(container).getByRole("radiogroup", { hidden: true });
};

const getRadio = (name: string) => screen.getByRole("radio", { name });

const findIndicator = (root: Element) => findRequiredElement(root, ".gdy-segmented-indicator");

const measureLargestBoxDifference = (first: Element, second: Element): number => {
  const firstBox = measureBox(first);
  const secondBox = measureBox(second);
  return Math.max(...BOX_EDGES.map((edge) => Math.abs(firstBox[edge] - secondBox[edge])));
};

// Polled: a new choice slides the indicator and a resize reaches it through
// ResizeObserver, one frame later.
const expectIndicatorOver = (root: Element, option: Element) =>
  expect.poll(() => measureLargestBoxDifference(findIndicator(root), option)).toBeLessThanOrEqual(ROUNDING_TOLERANCE_PX);

const isWithinHorizontally = (inner: Element, outer: Element): boolean => {
  const innerBox = measureBox(inner);
  const outerBox = measureBox(outer);
  return innerBox.left >= outerBox.left && innerBox.right <= outerBox.right;
};

const splitShadowLayers = (boxShadow: string): string[] => boxShadow.split(/,(?![^(]*\))/);

// Set through the CSSOM: a React style object would need camelCase keys.
const renderTokenReference = (property: string, token: string) => {
  const { container } = render(<span />);
  const reference = findRequiredElement(container, "span") as HTMLElement;
  reference.style.setProperty(property, `var(${token})`);
  return readStyle(reference, property);
};

test.each(SCENARIOS)("the indicator covers the chosen option, also after a new choice ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  const root = renderCalendarView();
  await expectIndicatorOver(root, getRadio("Mes"));
  await userEvent.click(getRadio("Día"));
  await expectIndicatorOver(root, getRadio("Día"));
});

test.each(SCENARIOS)("the indicator follows the option when the font size token grows ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  const root = renderCalendarView({}, { defaultValue: "week" });
  await expectIndicatorOver(root, getRadio("Semana"));
  const widthBefore = measureBox(getRadio("Semana")).width;
  screen.getByTestId("wrapper").style.setProperty("--gdy-segmented-font-size", "1.25rem");
  expect(measureBox(getRadio("Semana")).width).toBeGreaterThan(widthBefore + ROUNDING_TOLERANCE_PX);
  await expectIndicatorOver(root, getRadio("Semana"));
});

test.each(SCENARIOS)("the indicator slides in 220ms, and not at all with animated={false} ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  const animatedRoot = renderCalendarView();
  const staticRoot = renderCalendarView({}, { animated: false });
  expect(readStyle(findIndicator(animatedRoot), "transition-duration")).toBe("0.22s");
  expect(readStyle(findIndicator(staticRoot), "transition-duration")).toBe("0s");
});

test.each(SCENARIOS)("the colors come from the theme tokens ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  const root = renderCalendarView();
  expect(readStyle(getRadio("Mes"), "color")).toBe(renderTokenReference("color", "--gdy-foreground"));
  expect(readStyle(getRadio("Semana"), "color")).toBe(renderTokenReference("color", "--gdy-muted-foreground"));
  expect(readStyle(findIndicator(root), "background-color")).toBe(renderTokenReference("background-color", "--gdy-background"));
  expect(readStyle(root, "background-color")).toBe(renderTokenReference("background-color", "--gdy-muted"));
});

test.each(SCENARIOS)("hover paints a subtle background only on an unchosen option ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderCalendarView();
  await userEvent.hover(getRadio("Semana"));
  expect(readStyle(getRadio("Semana"), "background-color")).not.toBe(TRANSPARENT);
  expect(readStyle(getRadio("Semana"), "color")).toBe(renderTokenReference("color", "--gdy-foreground"));
  await userEvent.hover(getRadio("Mes"));
  expect(readStyle(getRadio("Mes"), "background-color")).toBe(TRANSPARENT);
});

test.each(SCENARIOS)("keyboard focus is an inset ring that grows neither the option nor the root ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  const root = renderCalendarView();
  const option = getRadio("Mes");
  const boxesBefore = [measureBox(root), measureBox(option)];
  await userEvent.tab();
  expect(option).toHaveFocus();
  expect(option.matches(":focus-visible")).toBe(true);
  const shadowLayers = splitShadowLayers(readStyle(option, "box-shadow"));
  expect(shadowLayers.every((layer) => layer.trim().endsWith("inset"))).toBe(true);
  expect([measureBox(root), measureBox(option)]).toEqual(boxesBefore);
});

test.each(SCENARIOS)("in a 166px container the root scrolls the options and End brings the last one into view ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  const root = renderCalendarView({ width: NARROW_CONTAINER_WIDTH });
  expect(measureBox(root).width).toBeLessThanOrEqual(NARROW_CONTAINER_WIDTH);
  expect(root.scrollWidth).toBeGreaterThan(root.clientWidth);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  await userEvent.tab();
  await userEvent.keyboard("{End}");
  expect(getRadio("Designados")).toHaveFocus();
  await expect.poll(() => isWithinHorizontally(getRadio("Designados"), root)).toBe(true);
  await expectIndicatorOver(root, getRadio("Designados"));
});

const centerOf = (element: Element) => {
  const { left, top, width, height } = measureBox(element);
  return { x: left + width / 2, y: top + height / 2 };
};

test("an app layer painted above the control also covers its options", () => {
  render(
    <div style={{ position: "relative" }}>
      <div data-testid="app-header" style={{ position: "absolute", inset: 0, zIndex: 1, background: "white" }} />
      <SegmentedControl aria-label="Vista del calendario" options={CALENDAR_VIEW_OPTIONS} defaultValue="month" />
    </div>,
  );
  const { x, y } = centerOf(getRadio("Semana"));
  expect(document.elementFromPoint(x, y)).toBe(screen.getByTestId("app-header"));
});

test("the first render places the indicator without sliding; a new choice slides it", async () => {
  const root = renderCalendarView();
  await expectIndicatorOver(root, getRadio("Mes"));
  expect(findIndicator(root).getAnimations()).toHaveLength(0);
  await userEvent.click(getRadio("Designados"));
  expect(findIndicator(root).getAnimations().length).toBeGreaterThan(0);
});

test("with animated={false} a new choice moves the indicator without an animation", async () => {
  const root = renderCalendarView({}, { animated: false });
  await userEvent.click(getRadio("Designados"));
  expect(findIndicator(root).getAnimations()).toHaveLength(0);
  await expectIndicatorOver(root, getRadio("Designados"));
});

test("a control shown after being hidden gets its indicator in place, without sliding", async () => {
  const hiddenRoot = renderCalendarView({ display: "none" }, { defaultValue: "day" });
  expect(hiddenRoot.querySelector(".gdy-segmented-indicator")).toBeNull();
  screen.getByTestId("wrapper").style.display = "block";
  await expectIndicatorOver(hiddenRoot, getRadio("Día"));
  expect(findIndicator(hiddenRoot).getAnimations()).toHaveLength(0);
});
