import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable, type ColumnDefinition, type ColumnOverflow } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { findRequiredElement } from "./browser/elements";
import { measureBox } from "./browser/measure";

const LONG_NOTE = "Cliente con contrato anual, renovación pendiente y tres sedes en distintas ciudades del país";
const NOTE_WIDTH = 160;
const WIDE_BADGE_WIDTH = 400;

const buildNoteColumn = (overflow?: ColumnOverflow): ColumnDefinition<BaselineRow> => ({
  id: "note",
  header: "Notas",
  accessor: () => LONG_NOTE,
  width: NOTE_WIDTH,
  overflow,
});

const buildBadgeColumn = (overflow?: ColumnOverflow): ColumnDefinition<BaselineRow> => ({
  id: "badge",
  header: "Insignia",
  accessor: () => "",
  cell: () => <span data-testid="badge" style={{ display: "inline-block", width: WIDE_BADGE_WIDTH }}>Insignia</span>,
  width: 120,
  overflow,
});

// The new column goes in the middle so whatever overflows it stays inside the scroll container.
const renderTable = (column: ColumnDefinition<BaselineRow>) =>
  render(
    <DataTable columns={[BASELINE_COLUMNS[0], column, ...BASELINE_COLUMNS.slice(1)]} data={BASELINE_ROWS} getRowId={(row) => row.id} />,
  ).container;

const measureCell = (container: HTMLElement, columnId: string) =>
  measureBox(findRequiredElement(container, `td[data-column-id="${columnId}"]`));

test("wrap grows the cell in height and keeps the width set by the column", () => {
  const cut = renderTable(buildNoteColumn());
  const cutCell = measureCell(cut, "note");
  cut.remove();
  const wrapped = measureCell(renderTable(buildNoteColumn("wrap")), "note");
  expect(wrapped.height).toBeGreaterThan(cutCell.height);
  expect(wrapped.width).toBe(cutCell.width);
  expect(wrapped.width).toBe(NOTE_WIDTH);
});

test("wrap shows the whole text, the default still cuts it", () => {
  const cut = findRequiredElement(renderTable(buildNoteColumn()), 'td[data-column-id="note"] .gdy-table-cell-content');
  expect(cut.scrollWidth).toBeGreaterThan(cut.clientWidth);
  const wrapped = findRequiredElement(renderTable(buildNoteColumn("wrap")), 'td[data-column-id="note"] .gdy-table-cell-content');
  expect(wrapped.scrollWidth).toBe(wrapped.clientWidth);
});

test("visible lets an element wider than the cell show whole", () => {
  const container = renderTable(buildBadgeColumn("visible"));
  const content = findRequiredElement(container, 'td[data-column-id="badge"] .gdy-table-cell-content');
  const badge = measureBox(findRequiredElement(container, '[data-testid="badge"]'));
  expect(getComputedStyle(content).overflow).toBe("visible");
  expect(badge.width).toBe(WIDE_BADGE_WIDTH);
  expect(badge.right).toBeGreaterThan(measureCell(container, "badge").right);
});

test("by default the same element is clipped by the cell", () => {
  const content = findRequiredElement(renderTable(buildBadgeColumn()), 'td[data-column-id="badge"] .gdy-table-cell-content');
  expect(getComputedStyle(content).overflow).toBe("hidden");
});
