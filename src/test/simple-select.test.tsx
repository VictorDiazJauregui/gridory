import { useState } from "react";
import { renderToString } from "react-dom/server";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { SimpleSelect, type SimpleSelectProps } from "../components/ui/select/select";

const OPTIONS = [
  { value: "dev", label: "Desarrollo" },
  { value: "design", label: "Diseño" },
];

type HarnessProps = Partial<SimpleSelectProps> & { initialValue: string };

const SelectHarness = ({ initialValue, ...props }: HarnessProps) => {
  const [value, setValue] = useState(initialValue);
  return (
    <SimpleSelect
      options={OPTIONS}
      value={value}
      onValueChange={setValue}
      placeholder="Elige un rol"
      ariaLabel="Rol"
      {...props}
    />
  );
};

const roleSelect = () => screen.getByRole("combobox", { name: "Rol" });

afterEach(() => vi.restoreAllMocks());

test("the select is the browser's own, so its list is the system one", () => {
  render(<SelectHarness initialValue="dev" />);
  expect(roleSelect()).toBeInstanceOf(HTMLSelectElement);
  expect(roleSelect()).toHaveClass("gdy-select-trigger");
});

test("a value outside the options shows the placeholder, which the list does not offer", () => {
  render(<SelectHarness initialValue="unknown" />);
  expect(roleSelect()).toHaveDisplayValue("Elige un rol");
  expect(roleSelect()).toHaveAttribute("data-placeholder");
  expect(within(roleSelect()).getAllByRole("option").map((option) => option.textContent)).toEqual(["Desarrollo", "Diseño"]);
});

test("a select that starts empty stays controlled when the first option is picked", async () => {
  const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  const user = userEvent.setup();
  render(<SelectHarness initialValue="" />);
  await user.selectOptions(roleSelect(), "Diseño");
  expect(roleSelect()).toHaveDisplayValue("Diseño");
  expect(roleSelect()).not.toHaveAttribute("data-placeholder");
  const warnings = consoleWarn.mock.calls.map((call) => String(call[0]));
  expect(warnings.filter((warning) => warning.includes("uncontrolled to controlled"))).toEqual([]);
});

test("the theme and the trigger props style the closed box itself", () => {
  render(
    <SelectHarness
      initialValue="dev"
      theme={{ background: "rgb(1, 2, 3)", radius: 4, triggerClassName: "theme-box" }}
      triggerClassName="consumer-box"
      triggerStyle={{ color: "rgb(4, 5, 6)" }}
      triggerAttributes={{ id: "role", "aria-required": true }}
    />,
  );
  expect(roleSelect()).toHaveClass("gdy-select-trigger", "theme-box", "consumer-box");
  expect(roleSelect()).toHaveAttribute("id", "role");
  expect(roleSelect()).toHaveAttribute("aria-required", "true");
  expect(roleSelect().style.getPropertyValue("--gdy-select-bg")).toBe("rgb(1, 2, 3)");
  expect(roleSelect().style.getPropertyValue("--gdy-select-radius")).toBe("4px");
  expect(roleSelect()).toHaveStyle({ color: "rgb(4, 5, 6)" });
});

test("the disabled prop disables the select", () => {
  render(<SelectHarness initialValue="dev" disabled />);
  expect(roleSelect()).toBeDisabled();
});

test("the server markup already shows the chosen option, before hydration", () => {
  const html = renderToString(<SimpleSelect options={OPTIONS} value="design" onValueChange={() => undefined} ariaLabel="Rol" />);
  expect(html).toContain('<option value="design" selected="">Diseño</option>');
});
