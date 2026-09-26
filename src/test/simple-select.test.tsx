import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { SimpleSelect } from "../components/ui/select/select";

const OPTIONS = [
  { value: "dev", label: "Desarrollo" },
  { value: "design", label: "Diseño" },
];

const SelectHarness = ({ initialValue }: { initialValue: string }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <SimpleSelect
      options={OPTIONS}
      value={value}
      onValueChange={setValue}
      placeholder="Elige un rol"
      ariaLabel="Rol"
    />
  );
};

afterEach(() => vi.restoreAllMocks());

test("a value outside the options shows the placeholder", () => {
  render(<SelectHarness initialValue="unknown" />);
  const trigger = screen.getByRole("combobox", { name: "Rol" });
  expect(trigger).toHaveTextContent("Elige un rol");
  expect(trigger).toHaveAttribute("data-placeholder");
});

test("a select that starts empty stays controlled when the first option is picked", async () => {
  const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  const user = userEvent.setup();
  render(<SelectHarness initialValue="" />);
  expect(screen.getByRole("combobox", { name: "Rol" })).toHaveTextContent("Elige un rol");
  await user.click(screen.getByRole("combobox", { name: "Rol" }));
  await user.click(await screen.findByRole("option", { name: "Diseño" }));
  expect(screen.getByRole("combobox", { name: "Rol" })).toHaveTextContent("Diseño");
  const warnings = consoleWarn.mock.calls.map((call) => String(call[0]));
  expect(warnings.filter((warning) => warning.includes("uncontrolled to controlled"))).toEqual([]);
});
