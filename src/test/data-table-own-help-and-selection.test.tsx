import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable } from "../components/table";
import { TableHeaderHelp } from "../components/table/header/TableHeaderHelp";
import type { HeaderCheckState } from "../components/table/selection/row-selection";
import { SelectCheckbox } from "../components/table/selection/SelectCheckbox";
import { BASELINE_COLUMNS, BASELINE_ROWS } from "./baseline-fixture";

// The markup Radix rendered in 1.5.0 (captured from its Checkbox and Tooltip trigger): consumers' CSS and tests
// read it, so the own checkbox and help keep it byte for byte.
const RADIX_CHECKBOX_MARKUP: [HeaderCheckState, boolean, string][] = [
  [false, false, "<button type=\"button\" role=\"checkbox\" aria-checked=\"false\" data-state=\"unchecked\" value=\"on\" class=\"gdy-table-select\" aria-label=\"Seleccionar fila\"></button>"],
  [false, true, "<button type=\"button\" role=\"checkbox\" aria-checked=\"false\" data-state=\"unchecked\" data-disabled=\"\" disabled=\"\" value=\"on\" class=\"gdy-table-select\" aria-label=\"Seleccionar fila\"></button>"],
  [true, false, "<button type=\"button\" role=\"checkbox\" aria-checked=\"true\" data-state=\"checked\" value=\"on\" class=\"gdy-table-select\" aria-label=\"Seleccionar fila\"><span data-state=\"checked\" class=\"gdy-table-select-indicator\" style=\"pointer-events: none;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-check\" aria-hidden=\"true\"><path d=\"M20 6 9 17l-5-5\"></path></svg></span></button>"],
  [true, true, "<button type=\"button\" role=\"checkbox\" aria-checked=\"true\" data-state=\"checked\" data-disabled=\"\" disabled=\"\" value=\"on\" class=\"gdy-table-select\" aria-label=\"Seleccionar fila\"><span data-state=\"checked\" data-disabled=\"\" class=\"gdy-table-select-indicator\" style=\"pointer-events: none;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-check\" aria-hidden=\"true\"><path d=\"M20 6 9 17l-5-5\"></path></svg></span></button>"],
  ["indeterminate", false, "<button type=\"button\" role=\"checkbox\" aria-checked=\"mixed\" data-state=\"indeterminate\" value=\"on\" class=\"gdy-table-select\" aria-label=\"Seleccionar fila\"><span data-state=\"indeterminate\" class=\"gdy-table-select-indicator\" style=\"pointer-events: none;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-minus\" aria-hidden=\"true\"><path d=\"M5 12h14\"></path></svg></span></button>"],
  ["indeterminate", true, "<button type=\"button\" role=\"checkbox\" aria-checked=\"mixed\" data-state=\"indeterminate\" data-disabled=\"\" disabled=\"\" value=\"on\" class=\"gdy-table-select\" aria-label=\"Seleccionar fila\"><span data-state=\"indeterminate\" data-disabled=\"\" class=\"gdy-table-select-indicator\" style=\"pointer-events: none;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-minus\" aria-hidden=\"true\"><path d=\"M5 12h14\"></path></svg></span></button>"],
]
const RADIX_HELP_TRIGGER_MARKUP = "<button data-state=\"closed\" type=\"button\" class=\"gdy-table-head-help\" aria-label=\"Ayuda sobre Usuarios\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-circle-question-mark\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"></path><path d=\"M12 17h.01\"></path></svg></button>";

const HELP = "Suma de los contratos vigentes";

const renderTable = () =>
  render(
    <DataTable
      columns={BASELINE_COLUMNS.map((column, index) => (index === 0 ? { ...column, headerTooltip: HELP } : column))}
      data={BASELINE_ROWS}
      getRowId={(row) => row.id}
      rowSelection={{}}
    />,
  ).container;

test.each(RADIX_CHECKBOX_MARKUP)("the checkbox (%s, disabled %s) renders the markup of the 1.5.0 Radix checkbox", (checked, disabled, markup) => {
  const props = { checked, disabled, label: "Seleccionar fila", onToggle: () => {} };
  expect(render(<SelectCheckbox {...props} />).container.innerHTML).toBe(markup);
});

test("the closed help renders the markup of the 1.5.0 Radix tooltip trigger", () => {
  expect(render(<TableHeaderHelp text="Ayuda" label="Ayuda sobre Usuarios" />).container.innerHTML).toBe(RADIX_HELP_TRIGGER_MARKUP);
});

test("the checkbox is in the first render and toggles at once, with no download to wait for", () => {
  const container = renderTable();
  const firstRowCheckbox = screen.getAllByRole("checkbox")[1];
  fireEvent.click(firstRowCheckbox);
  expect(firstRowCheckbox).toHaveAttribute("aria-checked", "true");
  expect(container.querySelector("tbody tr")).toHaveAttribute("data-selected");
});

test("a click on the ? opens the tooltip in the same render, outside any Radix wrapper", () => {
  renderTable();
  fireEvent.click(screen.getByRole("button", { name: /Ayuda sobre/ }));
  const tooltip = screen.getByRole("tooltip");
  expect(tooltip).toHaveTextContent(HELP);
  expect(tooltip.closest("[data-radix-popper-content-wrapper]")).toBeNull();
});

test("Enter on a checkbox does not toggle it; a click (Space on a button) does", () => {
  renderTable();
  const checkbox = screen.getAllByRole("checkbox")[1];
  fireEvent.keyDown(checkbox, { key: "Enter" });
  expect(checkbox).toHaveAttribute("aria-checked", "false");
  fireEvent.click(checkbox);
  expect(checkbox).toHaveAttribute("aria-checked", "true");
});

test("the tooltip closes with Escape and when the ? loses the focus", () => {
  renderTable();
  const help = screen.getByRole("button", { name: /Ayuda sobre/ });
  fireEvent.click(help);
  fireEvent.keyDown(help, { key: "Escape" });
  expect(screen.queryByRole("tooltip")).toBeNull();
  fireEvent.click(help);
  fireEvent.blur(help);
  expect(screen.queryByRole("tooltip")).toBeNull();
});
