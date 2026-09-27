import type { CSSProperties, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { PhoneInput } from "../components/phone-input";
import type { PhoneInputProps } from "../components/phone-input";
import { FLOATING_PANEL_PLACEMENT } from "../components/shared/floating-panel/floating-panel-placement";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, applyTheme } from "./browser/environment";
import type { ScreenName, Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";

interface Scenario {
  theme: Theme;
  screen: ScreenName;
}

interface WidthScenario extends Scenario {
  width: number;
}

const THEMES: Theme[] = ["light", "dark"];
const SCREEN_NAMES: ScreenName[] = ["desktop", "iphone14Pro"];
const FIELD_WIDTHS = [200, 300, 500];
const SCENARIOS: Scenario[] = THEMES.flatMap((theme) => SCREEN_NAMES.map((screenName) => ({ theme, screen: screenName })));
const WIDTH_SCENARIOS: WidthScenario[] = SCENARIOS.flatMap((scenario) => FIELD_WIDTHS.map((width) => ({ ...scenario, width })));

// The tests never wait on flagcdn: every flag is a local one-pixel image.
const LOCAL_FLAG_URL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const PANEL_MIN_WIDTH = 280;
const BORDER_WIDTH = 1;
// Label plus box, and the room left under them: less than the panel needs.
const FIELD_HEIGHT = 66;
const ROOM_BELOW_FIELD = 24;
const TRANSPARENT = "rgba(0, 0, 0, 0)";

const resolveLocalFlag = () => LOCAL_FLAG_URL;

const applyScenario = async ({ theme, screen: screenName }: Scenario) => {
  applyTheme(theme);
  await applyScreen(screenName);
};

const renderPhoneInput = (props: PhoneInputProps = {}) => render(<PhoneInput flagUrl={resolveLocalFlag} {...props} />);

const renderInScroller = (content: ReactNode, scrollerStyle: CSSProperties) =>
  render(
    <div data-testid="scroller" style={{ overflowY: "auto", ...scrollerStyle }}>
      {content}
    </div>,
  );

const prefix = () => screen.getByRole("combobox", { name: /^Prefijo/ });

const numberInput = () => screen.getByRole("textbox", { name: "Teléfono" });

const findBox = () => findRequiredElement(document.body, ".gdy-phone-input");

const findPanel = () => findRequiredElement(document.body, ".gdy-phone-input-panel");

const measureParts = () => ({ box: measureBox(findBox()), prefix: measureBox(prefix()), number: measureBox(numberInput()) });

const openList = async () => {
  await userEvent.click(prefix());
  return screen.findByRole("dialog", { name: "Prefijos por país" });
};

const measureGapToBox = () => {
  const panel = measureBox(findPanel());
  const box = measureBox(findBox());
  return findPanel().getAttribute("data-side") === "top" ? box.top - panel.bottom : panel.top - box.bottom;
};

// Floating UI places the panel a frame later and the opening animation scales
// it, so layout assertions wait until it rests at its offset and full size.
const waitUntilPanelRests = () => expect.poll(measureGapToBox).toBe(FLOATING_PANEL_PLACEMENT.sideOffset);

const splitShadowLayers = (boxShadow: string): string[] => boxShadow.split(/,(?![^(]*\))/);

const expectInsetFocusOnly = () => {
  const layers = splitShadowLayers(readStyle(findBox(), "box-shadow"));
  expect(layers.every((layer) => layer.trim().endsWith("inset"))).toBe(true);
  expect(readStyle(findBox(), "outline-color")).toBe(TRANSPARENT);
};

// Set through the CSSOM: a React style object would need camelCase keys.
const renderColorReference = (value: string) => {
  const { container } = render(<span />);
  const reference = findRequiredElement(container, "span") as HTMLElement;
  reference.style.setProperty("color", value);
  return readStyle(reference, "color");
};

test.each(WIDTH_SCENARIOS)("prefix and number share one frame with no divider, inside a $width px box ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderPhoneInput({ width: scenario.width, defaultValue: { country: "PE", number: "999 111 222 333 444 555" } });
  const { box, prefix: prefixBox, number } = measureParts();
  expect(readStyle(prefix(), "border-right-width")).toBe("0px");
  expect(readStyle(prefix(), "background-color")).toBe(TRANSPARENT);
  expect(readStyle(numberInput(), "background-color")).toBe(TRANSPARENT);
  expect(number.right).toBeLessThanOrEqual(box.right - BORDER_WIDTH);
  expect(box.right).toBeLessThanOrEqual(window.innerWidth);
  expect(prefixBox.height).toBe(box.height - 2 * BORDER_WIDTH);
  expect(number.height).toBe(box.height - 2 * BORDER_WIDTH);
});

test.each(SCENARIOS)("focusing the prefix and then the number never changes a size, and the ring is inset ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderPhoneInput({ width: 300, defaultCountry: "PE" });
  const before = measureParts();
  await userEvent.tab();
  expect(prefix()).toHaveFocus();
  expect(measureParts()).toEqual(before);
  expectInsetFocusOnly();
  await userEvent.tab();
  expect(numberInput()).toHaveFocus();
  expect(measureParts()).toEqual(before);
  expectInsetFocusOnly();
});

test.each(SCENARIOS)("the box is 40px tall by default and follows the height token ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  render(
    <div style={{ "--gdy-phone-input-height": "48px" } as CSSProperties}>
      <PhoneInput flagUrl={resolveLocalFlag} />
    </div>,
  );
  expect(measureBox(findBox()).height).toBe(48);
  findBox().closest<HTMLElement>("[style]")?.style.removeProperty("--gdy-phone-input-height");
  expect(measureBox(findBox()).height).toBe(40);
});

test.each(SCENARIOS)("near the bottom edge the list of dial codes opens above ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  const spaceAboveField = window.innerHeight - FIELD_HEIGHT - ROOM_BELOW_FIELD;
  renderInScroller(
    <>
      <div style={{ height: spaceAboveField }} />
      <PhoneInput flagUrl={resolveLocalFlag} defaultCountry="PE" />
      <div style={{ height: 2 * window.innerHeight }} />
    </>,
    { height: window.innerHeight },
  );
  await openList();
  await waitUntilPanelRests();
  expect(findPanel()).toHaveAttribute("data-side", "top");
});

test.each(SCENARIOS)("the list is at least 280px and never narrower than the field ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  const { unmount } = renderPhoneInput({ width: 200 });
  await openList();
  await waitUntilPanelRests();
  await expect.poll(() => measureBox(findPanel()).width).toBe(PANEL_MIN_WIDTH);
  unmount();
  renderPhoneInput({ width: 360 });
  await openList();
  await waitUntilPanelRests();
  await expect.poll(() => measureBox(findPanel()).width).toBe(measureBox(findBox()).width);
});

test.each(SCENARIOS)("with Uruguay chosen, its option opens inside the visible area of the list ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderPhoneInput({ defaultCountry: "UY" });
  await openList();
  await waitUntilPanelRests();
  const list = screen.getByRole("listbox", { name: "Prefijos por país" });
  const option = screen.getByRole("option", { name: /^Uruguay/ });
  expect(list.scrollTop).toBeGreaterThan(0);
  await expect.poll(() => measureBox(option).top >= measureBox(list).top && measureBox(option).bottom <= measureBox(list).bottom).toBe(true);
});

test.each(SCENARIOS)("the list scrolls with a thin scrollbar in the token color ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  renderPhoneInput();
  await openList();
  const list = screen.getByRole("listbox", { name: "Prefijos por país" });
  const thumbColor = renderColorReference("var(--gdy-scrollbar-thumb, var(--gdy-input))");
  expect(readStyle(list, "scrollbar-width")).toBe("thin");
  expect(readStyle(list, "scrollbar-color")).toBe(`${thumbColor} ${TRANSPARENT}`);
});

test.each(THEMES)("the box border follows the theme token and an error paints it with the destructive token (%s)", (theme) => {
  applyTheme(theme);
  const { rerender } = renderPhoneInput();
  expect(readStyle(findBox(), "border-top-color")).toBe(renderColorReference("var(--gdy-input)"));
  rerender(<PhoneInput flagUrl={resolveLocalFlag} error="Ingresa un teléfono válido" />);
  expect(readStyle(findBox(), "border-top-color")).toBe(renderColorReference("var(--gdy-destructive)"));
});

test.each(SCENARIOS)("squeezed below the width of its prefix, the box stays inside its container and clips its parts ($theme, $screen)", async (scenario) => {
  await applyScenario(scenario);
  render(
    <div data-testid="container" style={{ width: 60 }}>
      <PhoneInput flagUrl={resolveLocalFlag} defaultValue={{ country: "PE", number: "999 111 222" }} />
    </div>,
  );
  const container = measureBox(screen.getByTestId("container"));
  expect(measureBox(findBox()).right).toBeLessThanOrEqual(container.right);
  expect(readStyle(findBox(), "overflow-x")).toBe("hidden");
});
