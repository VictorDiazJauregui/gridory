import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { DataTable, type ColumnDefinition } from "../components/table";
import type { BaselineRow } from "./baseline-fixture";
import { findRequiredElement } from "./browser/elements";
import { measureBox } from "./browser/measure";
import { dragPointer } from "./browser/pointer-drag";

type Column = ColumnDefinition<BaselineRow>;

const ROWS: BaselineRow[] = [
  { id: "r1", name: "Frío Delta", country: "Perú", status: "Activa" },
  { id: "r2", name: "Pack Norte", country: "Chile", status: "Archivada" },
];

// No widths: the columns start stretched to fill the container, so any growth no longer fits.
const COLUMNS: Column[] = [
  { id: "name", header: "Empresa", accessor: (row) => row.name },
  { id: "country", header: "País", accessor: (row) => row.country, priority: 5 },
  { id: "status", header: "Estado", accessor: (row) => row.status, priority: 3 },
];

const ONLY_STATUS_HIDEABLE = COLUMNS.map((column) => (column.id === "country" ? { ...column, priority: undefined } : column));

const renderTable = (columns = COLUMNS) => {
  const { container } = render(
    <div style={{ width: 600 }}>
      <DataTable columns={columns} data={ROWS} getRowId={(row) => row.id} responsiveColumns resizableColumns />
    </div>,
  );
  return container;
};

const headerOf = (container: HTMLElement, id: string) =>
  findRequiredElement(container, `thead th[data-column-id="${id}"]`) as HTMLElement;
const handleSelector = (id: string) => `th[data-column-id="${id}"] > .gdy-table-resize-handle`;
const handleOf = (container: HTMLElement, id: string) => findRequiredElement(container, handleSelector(id)) as HTMLElement;
const hiddenColumnIds = (container: HTMLElement) =>
  [...container.querySelectorAll('thead th[data-hidden-by="priority"]')].map((cell) => cell.getAttribute("data-column-id"));
const readOverflow = (container: HTMLElement) => {
  const wrap = findRequiredElement(container, ".gdy-table-wrap");
  return wrap.scrollWidth - wrap.clientWidth;
};

// The priority runs once per frame after the release: two frames let it settle before reading the outcome.
const settleLayout = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

const widenWithKeyboard = async (container: HTMLElement, id: string) => {
  handleOf(container, id).focus();
  await userEvent.keyboard("{ArrowRight}");
};

test("widening the lowest priority column with the keyboard hides the next one and keeps the focus on its handle", async () => {
  const container = renderTable();
  const widthBefore = measureBox(headerOf(container, "status")).width;
  await widenWithKeyboard(container, "status");
  await expect.poll(() => hiddenColumnIds(container)).toEqual(["country"]);
  expect(measureBox(headerOf(container, "status")).width).toBeGreaterThan(widthBefore);
  expect(document.activeElement).toBe(handleOf(container, "status"));
  expect(readOverflow(container)).toBeLessThanOrEqual(0);
});

test("widening it with the pointer keeps it at its new width and leaves the focus where it was", async () => {
  const container = renderTable();
  const widthBefore = measureBox(headerOf(container, "status")).width;
  handleOf(container, "status").focus();
  await dragPointer({ selector: handleSelector("status"), deltaX: 40, steps: 8 });
  await expect.poll(() => hiddenColumnIds(container)).toEqual(["country"]);
  expect(measureBox(headerOf(container, "status")).width).toBe(widthBefore + 40);
  expect(document.activeElement).toBe(handleOf(container, "status"));
});

test("when the widened column is the only hideable one, nothing hides and the grid scrolls sideways", async () => {
  const container = renderTable(ONLY_STATUS_HIDEABLE);
  await widenWithKeyboard(container, "status");
  await settleLayout();
  expect(hiddenColumnIds(container)).toEqual([]);
  expect(readOverflow(container)).toBeGreaterThan(0);
  expect(document.activeElement).toBe(handleOf(container, "status"));
});

test("the widened column stays in sight when the container narrows afterwards", async () => {
  const container = renderTable();
  await widenWithKeyboard(container, "status");
  await expect.poll(() => hiddenColumnIds(container)).toEqual(["country"]);
  (container.firstElementChild as HTMLElement).style.width = "300px";
  await expect.poll(() => readOverflow(container)).toBeGreaterThan(0);
  expect(hiddenColumnIds(container)).toEqual(["country"]);
});

test("resizing another column releases the first one, which hides again by priority", async () => {
  const container = renderTable();
  await widenWithKeyboard(container, "status");
  await expect.poll(() => hiddenColumnIds(container)).toEqual(["country"]);
  await widenWithKeyboard(container, "name");
  await expect.poll(() => hiddenColumnIds(container)).toContain("status");
  expect(document.activeElement).toBe(handleOf(container, "name"));
});
