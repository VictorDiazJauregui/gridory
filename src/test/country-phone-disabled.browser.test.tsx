import type { CSSProperties } from "react";
import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { CountrySelect } from "../components/country-select";
import { PhoneInput } from "../components/phone-input";
import { findRequiredElement } from "./browser/elements";
import { applyTheme } from "./browser/environment";
import type { Theme } from "./browser/environment";
import { readStyle } from "./browser/measure";

const THEMES: Theme[] = ["light", "dark"];
const LOCAL_FLAG_URL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const CUSTOM_DISABLED_TOKENS = {
  "--gdy-country-select-disabled-opacity": "0.3",
  "--gdy-country-select-disabled-bg": "rgb(10, 20, 30)",
  "--gdy-phone-input-disabled-opacity": "0.3",
  "--gdy-phone-input-disabled-bg": "rgb(10, 20, 30)",
} as CSSProperties;

const resolveLocalFlag = () => LOCAL_FLAG_URL;

// Set through the CSSOM: a React style object would need camelCase keys.
const renderBackgroundReference = (value: string) => {
  const { container } = render(<span />);
  const reference = findRequiredElement(container, "span") as HTMLElement;
  reference.style.setProperty("background-color", value);
  return readStyle(reference, "background-color");
};

const renderBothControls = (disabled: boolean, style: CSSProperties = {}) =>
  render(
    <div style={style}>
      <CountrySelect disabled={disabled} flagUrl={resolveLocalFlag} defaultValue="PE" />
      <PhoneInput disabled={disabled} flagUrl={resolveLocalFlag} defaultCountry="PE" />
    </div>,
  );

const findBoxes = () => [".gdy-country-select", ".gdy-phone-input"].map((selector) => findRequiredElement(document.body, selector));

test.each(THEMES)("disabled boxes fade to half and take the muted background (%s)", (theme) => {
  applyTheme(theme);
  renderBothControls(true);
  const muted = renderBackgroundReference("var(--gdy-muted)");
  for (const box of findBoxes()) {
    expect(readStyle(box, "opacity")).toBe("0.5");
    expect(readStyle(box, "background-color")).toBe(muted);
    expect(readStyle(box, "cursor")).toBe("not-allowed");
  }
});

test.each(THEMES)("enabled boxes keep their 2.2.0 look (%s)", (theme) => {
  applyTheme(theme);
  renderBothControls(false);
  const background = renderBackgroundReference("var(--gdy-background)");
  for (const box of findBoxes()) {
    expect(readStyle(box, "opacity")).toBe("1");
    expect(readStyle(box, "background-color")).toBe(background);
  }
});

test("the disabled look follows its tokens", () => {
  renderBothControls(true, CUSTOM_DISABLED_TOKENS);
  for (const box of findBoxes()) {
    expect(readStyle(box, "opacity")).toBe("0.3");
    expect(readStyle(box, "background-color")).toBe("rgb(10, 20, 30)");
  }
});
