import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { formatTable, insertTable } from "../components/markdown-editor/commands/insertions";
import { clampTableSize } from "../components/markdown-editor/dialogs/table-size";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

test.each([
  { table: { rows: 1, columns: 2, alignment: "left" as const }, markdown: "|  |  |\n| :--- | :--- |\n|  |  |" },
  { table: { rows: 2, columns: 1, alignment: "right" as const }, markdown: "|  |\n| ---: |\n|  |\n|  |" },
])("formats a $table.rows × $table.columns table", ({ table, markdown }) => {
  expect(formatTable(table)).toBe(markdown);
});

test("puts the cursor in the first header cell", () => {
  const result = insertTable({ rows: 1, columns: 1, alignment: "center" })({ text: "", selection: { from: 0, to: 0 } });
  expect(result.selection).toEqual({ from: 2, to: 2 });
});

test.each([
  { value: 0, max: 20, expected: 1 },
  { value: 7.8, max: 20, expected: 7 },
  { value: 50, max: 20, expected: 20 },
  { value: Number.NaN, max: 20, expected: 1 },
])("clamps $value to $expected", ({ value, max, expected }) => {
  expect(clampTableSize(value, max)).toBe(expected);
});

test("caps the size at the configured limits and draws the grid", async () => {
  render(<MarkdownEditor limits={{ tableRows: 5, tableColumns: 3 }} />);
  await userEvent.click(screen.getByRole("button", { name: "Tabla" }));
  const rows = await screen.findByRole("spinbutton", { name: "Filas" });
  await userEvent.clear(rows);
  await userEvent.type(rows, "9");
  expect(rows).toHaveValue(5);
  expect(screen.getByRole("status")).toHaveTextContent("Se ajustó al máximo permitido. Hasta 5 filas y 3 columnas.");
  await userEvent.click(screen.getByRole("radio", { name: "Derecha" }));
  const preview = screen.getByRole("figure", { name: "Vista previa de la tabla" });
  expect(preview).toHaveAttribute("data-alignment", "right");
  expect(preview.querySelectorAll(".gdy-md-table-preview-cell")).toHaveLength(18);
});
