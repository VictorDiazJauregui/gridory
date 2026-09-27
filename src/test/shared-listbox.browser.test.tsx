import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Listbox } from "../components/shared/listbox/Listbox";
import type { ListboxOption } from "../components/shared/listbox/listbox-props";
import { findRequiredElement } from "./browser/elements";
import { applyTheme } from "./browser/environment";
import type { Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";

const THEMES: Theme[] = ["light", "dark"];
const LONG_LABEL = "Islas Georgias del Sur y Sandwich del Sur (territorio británico de ultramar)";
const THUMB_COLOR = "rgb(255, 99, 71)";
const TRANSPARENT = "rgba(0, 0, 0, 0)";

const OPTIONS: ListboxOption[] = [
  { value: "AR", label: "Argentina" },
  { value: "PE", label: "Perú" },
  { value: "GS", label: LONG_LABEL },
];

const keepSelection = () => undefined;

// Narrower than the long label, so only the ellipsis can make it fit.
const renderNarrowListbox = () =>
  render(
    <div style={{ width: 200 }}>
      <Listbox
        aria-label="Países"
        options={OPTIONS}
        selectedValues={["PE"]}
        onSelect={keepSelection}
        scrollbarColor={THUMB_COLOR}
      />
    </div>,
  );

const findLabel = (name: string) =>
  findRequiredElement(screen.getByRole("option", { name }), ".gdy-listbox-label");

test.each(THEMES)("a selected and an unselected label start at the same x (%s)", (theme) => {
  applyTheme(theme);
  renderNarrowListbox();
  expect(measureBox(findLabel("Perú")).left).toBe(measureBox(findLabel("Argentina")).left);
});

test.each(THEMES)("a label wider than the list is cut with an ellipsis (%s)", (theme) => {
  applyTheme(theme);
  renderNarrowListbox();
  const label = findLabel(LONG_LABEL);
  expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
  expect(readStyle(label, "text-overflow")).toBe("ellipsis");
});

test.each(THEMES)("the options scroll with a thin scrollbar in the scrollbarColor (%s)", (theme) => {
  applyTheme(theme);
  renderNarrowListbox();
  const list = screen.getByRole("listbox", { name: "Países" });
  expect(readStyle(list, "scrollbar-width")).toBe("thin");
  expect(readStyle(list, "scrollbar-color")).toBe(`${THUMB_COLOR} ${TRANSPARENT}`);
});
