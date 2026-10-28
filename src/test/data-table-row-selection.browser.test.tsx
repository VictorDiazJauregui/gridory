import { render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { DataTable, type DataTableProps } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { readColorContrast } from "./browser/contrast";
import { findRequiredElement } from "./browser/elements";
import { applyTheme, type Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";
import { emulateMediaType } from "./browser/print-media";

afterEach(async () => {
  applyTheme("light");
  await emulateMediaType("screen");
});

const renderTable = (props: Partial<DataTableProps<BaselineRow>> = {}) =>
  render(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />)
    .container;

const rowHeight = (container: HTMLElement) => measureBox(findRequiredElement(container, ".gdy-table-row")).height;

test.each(["light", "dark"] as Theme[])("in %s the checkbox does not change the row height", (theme) => {
  applyTheme(theme);
  const withoutSelection = rowHeight(renderTable());
  const withSelection = rowHeight(renderTable({ rowSelection: {} }));
  expect(withSelection).toBe(withoutSelection);
});

test.each(["light", "dark"] as Theme[])("in %s the checkbox edge and the selected row read clearly", (theme) => {
  applyTheme(theme);
  const container = renderTable({ rowSelection: { defaultSelectedIds: ["b1"] } });
  const checkbox = findRequiredElement(container, '[data-row-id="b2"] .gdy-table-select');
  const cell = findRequiredElement(container, '[data-row-id="b2"] .gdy-table-cell');
  expect(readColorContrast(readStyle(checkbox, "border-top-color"), readStyle(cell, "background-color"))).toBeGreaterThanOrEqual(3);
  const selectedCell = findRequiredElement(container, '[data-row-id="b1"] .gdy-table-cell');
  expect(readStyle(selectedCell, "background-color")).not.toBe(readStyle(cell, "background-color"));
});

test("the keyboard focus of a checkbox draws a ring", () => {
  const container = renderTable({ rowSelection: {} });
  const checkbox = findRequiredElement(container, '[data-row-id="b1"] .gdy-table-select') as HTMLElement;
  checkbox.focus({ focusVisible: true } as FocusOptions);
  expect(readStyle(checkbox, "outline-style")).toBe("solid");
  expect(readStyle(checkbox, "outline-width")).toBe("2px");
});

test("printing shows Sí/No and printValue instead of the checkbox and the cell content", async () => {
  const columns = BASELINE_COLUMNS.map((column) =>
    column.id === "status" ? { ...column, printValue: (row: BaselineRow) => `[${row.status}]` } : column,
  );
  const container = renderTable({ columns, printMode: "page", rowSelection: { defaultSelectedIds: ["b1"] } });
  await emulateMediaType("print");
  const selectHeader = findRequiredElement(container, 'th[data-column-id="_select"]');
  expect(selectHeader.scrollWidth).toBeLessThanOrEqual(selectHeader.clientWidth);
  const selectCell = findRequiredElement(container, '[data-row-id="b1"] [data-column-id="_select"]');
  expect(selectCell).toHaveTextContent("Sí");
  expect(readStyle(findRequiredElement(selectCell, ".gdy-table-select"), "display")).toBe("none");
  const statusCell = findRequiredElement(container, '[data-row-id="b1"] [data-column-id="status"]');
  expect(readStyle(findRequiredElement(statusCell, ".gdy-table-print-value"), "display")).toBe("inline");
  expect(readStyle(findRequiredElement(statusCell, ".gdy-table-cell-content"), "display")).toBe("none");
  expect(readStyle(findRequiredElement(container, '[data-row-id="b1"] .gdy-table-cell'), "background-color")).toBe(
    "rgba(0, 0, 0, 0)",
  );
});

test("on screen the print text stays hidden", () => {
  const container = renderTable({ printMode: "page", rowSelection: {} });
  expect(readStyle(findRequiredElement(container, ".gdy-table-print-value"), "display")).toBe("none");
});
