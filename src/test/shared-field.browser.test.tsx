import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { Field } from "../components/shared/field/Field";
import type { FieldControlAttributes, FieldLabelPosition } from "../components/shared/field/field-props";
import { findRequiredElement } from "./browser/elements";
import { applyTheme } from "./browser/environment";
import type { Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";
import type { MeasuredBox } from "./browser/measure";

const THEMES: Theme[] = ["light", "dark"];

// Border-box, so the control is 40px tall whatever its border and padding.
const fortyPixelInput = (control: FieldControlAttributes) => (
  <input {...control} style={{ display: "block", boxSizing: "border-box", blockSize: 40 }} />
);

const renderField = (labelPosition: FieldLabelPosition) => {
  const { container } = render(
    <Field label="País" labelPosition={labelPosition} required error="Elige un país">
      {fortyPixelInput}
    </Field>,
  );
  const measure = (selector: string) => measureBox(findRequiredElement(container, selector));
  return { label: measure(".gdy-field-label"), control: measure("input"), error: measure(".gdy-field-error") };
};

const verticalCenterOf = (box: MeasuredBox): number => box.top + box.height / 2;

test.each(THEMES)("a start label is as tall as the control and centered with it (%s)", (theme) => {
  applyTheme(theme);
  const { label, control } = renderField("start");
  expect(label.height).toBe(40);
  expect(Math.abs(verticalCenterOf(label) - verticalCenterOf(control))).toBeLessThanOrEqual(1);
  expect(label.right).toBeLessThanOrEqual(control.left);
});

test.each(THEMES)("with a start label the error goes under the control, aligned to it (%s)", (theme) => {
  applyTheme(theme);
  const { control, error } = renderField("start");
  expect(error.top).toBeGreaterThanOrEqual(control.bottom);
  expect(Math.abs(error.left - control.left)).toBeLessThanOrEqual(1);
});

test.each(THEMES)("a top label sits above the control (%s)", (theme) => {
  applyTheme(theme);
  const { label, control, error } = renderField("top");
  expect(label.bottom).toBeLessThanOrEqual(control.top);
  expect(error.top).toBeGreaterThanOrEqual(control.bottom);
});

test.each(THEMES)("the error paints the destructive token (%s)", (theme) => {
  applyTheme(theme);
  const { container } = render(
    <>
      <span data-testid="destructive-reference" style={{ color: "var(--gdy-destructive)" }} />
      <Field aria-label="País" error="Elige un país">
        {fortyPixelInput}
      </Field>
    </>,
  );
  const destructiveReference = findRequiredElement(container, "[data-testid='destructive-reference']");
  const errorMessage = findRequiredElement(container, ".gdy-field-error");
  expect(readStyle(errorMessage, "color")).toBe(readStyle(destructiveReference, "color"));
  expect(readStyle(errorMessage, "color")).not.toBe(readStyle(container, "color"));
});
