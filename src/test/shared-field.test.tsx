import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { AccessibleName } from "../components/shared/accessible-name";
import { Field } from "../components/shared/field/Field";
import { MissingFieldLabelError } from "../components/shared/field/field-accessible-name";
import type { FieldControlAttributes } from "../components/shared/field/field-props";
import { expectRenderError } from "./expect-render-error";

const textInput = (control: FieldControlAttributes) => <input {...control} />;

const textInputWithListbox = (control: FieldControlAttributes, labelling: AccessibleName) => (
  <>
    <input {...control} />
    <div role="listbox" {...labelling} />
  </>
);

test.each(["top", "start"] as const)("getByLabelText finds the control with the label at %s", (labelPosition) => {
  const { container } = render(
    <Field label="País" labelPosition={labelPosition}>
      {textInput}
    </Field>,
  );
  expect(screen.getByLabelText("País")).toBe(screen.getByRole("textbox"));
  expect(container.querySelector(".gdy-field")).toHaveAttribute("data-label-position", labelPosition);
});

test("the label goes on top by default and the className joins the root", () => {
  const { container } = render(
    <Field label="País" className="checkout-country">
      {textInput}
    </Field>,
  );
  expect(container.firstElementChild).toHaveClass("gdy-field", "checkout-country");
  expect(container.firstElementChild).toHaveAttribute("data-label-position", "top");
});

test("the error describes the control and marks it invalid", () => {
  render(
    <Field label="País" error="Elige un país">
      {textInput}
    </Field>,
  );
  const control = screen.getByRole("textbox", { name: "País" });
  expect(control).toHaveAttribute("aria-invalid", "true");
  expect(control).toHaveAttribute("aria-describedby", screen.getByText("Elige un país").id);
  expect(control).toHaveAccessibleDescription("Elige un país");
});

test("without an error the control is neither invalid nor described", () => {
  const { container } = render(
    <Field label="País" error="">
      {textInput}
    </Field>,
  );
  const control = screen.getByRole("textbox", { name: "País" });
  expect(control).not.toHaveAttribute("aria-invalid");
  expect(control).not.toHaveAttribute("aria-describedby");
  expect(container.querySelector(".gdy-field-error")).toBeNull();
});

test("required sets aria-required and an asterisk hidden from assistive technology", () => {
  render(
    <Field label="País" required>
      {textInput}
    </Field>,
  );
  const control = screen.getByRole("textbox", { name: "País" });
  expect(control).toHaveAttribute("aria-required", "true");
  expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
});

test("an optional field has neither aria-required nor the asterisk", () => {
  render(
    <Field label="País">
      {textInput}
    </Field>,
  );
  expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-required");
  expect(screen.queryByText("*")).toBeNull();
});

test("aria-label names the control when there is no visible label", () => {
  const { container } = render(
    <Field aria-label="País">
      {textInput}
    </Field>,
  );
  expect(screen.getByRole("textbox", { name: "País" })).toBeInTheDocument();
  expect(container.querySelector("label")).toBeNull();
});

test("aria-labelledby names the control through an element of the consumer", () => {
  render(
    <>
      <h2 id="shipping-country">País de envío</h2>
      <Field aria-labelledby="shipping-country">{textInput}</Field>
    </>,
  );
  expect(screen.getByRole("textbox", { name: "País de envío" })).toBeInTheDocument();
});

test("a field without an accessible name throws MissingFieldLabelError", () => {
  // @ts-expect-error: the naming union rejects a field without any accessible name
  expectRenderError(<Field>{textInput}</Field>, MissingFieldLabelError);
  expectRenderError(<Field label="   ">{textInput}</Field>, MissingFieldLabelError);
  expectRenderError(<Field aria-label="">{textInput}</Field>, MissingFieldLabelError);
  expectRenderError(<Field aria-labelledby=" ">{textInput}</Field>, MissingFieldLabelError);
});

test("with a visible label the labelling points at the rendered <label>", () => {
  const { container } = render(<Field label="País">{textInputWithListbox}</Field>);
  const visibleLabel = container.querySelector("label");
  const listbox = screen.getByRole("listbox", { name: "País" });
  expect(visibleLabel).toBeInTheDocument();
  expect(listbox).toHaveAttribute("aria-labelledby", visibleLabel?.id);
  expect(listbox).not.toHaveAttribute("aria-label");
});

test("with aria-label the labelling repeats it and points at no label", () => {
  render(<Field aria-label="País">{textInputWithListbox}</Field>);
  const listbox = screen.getByRole("listbox", { name: "País" });
  expect(listbox).toHaveAttribute("aria-label", "País");
  expect(listbox).not.toHaveAttribute("aria-labelledby");
});

test("with aria-labelledby the labelling points at the element of the consumer", () => {
  render(
    <>
      <h2 id="shipping-country">País de envío</h2>
      <Field aria-labelledby="shipping-country">{textInputWithListbox}</Field>
    </>,
  );
  const listbox = screen.getByRole("listbox", { name: "País de envío" });
  expect(listbox).toHaveAttribute("aria-labelledby", "shipping-country");
  expect(listbox).not.toHaveAttribute("aria-label");
});
