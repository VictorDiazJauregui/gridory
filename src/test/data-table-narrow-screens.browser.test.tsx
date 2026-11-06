import { render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { DataTable, type ColumnDefinition } from "../components/table";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, type ScreenName } from "./browser/environment";
import { measureBox } from "./browser/measure";

afterEach(() => applyScreen("desktop"));

interface CompanyRow {
  id: string;
  name: string;
  country: string;
  status: string;
  revenue: number;
  createdAt: string;
}

const ROWS: CompanyRow[] = [
  { id: "1", name: "Frío Delta", country: "Perú", status: "Activa", revenue: 1200, createdAt: "2026-01-12" },
  { id: "2", name: "Pack Norte", country: "Chile", status: "Pendiente", revenue: 800, createdAt: "2025-11-03" },
];

const COLUMNS: ColumnDefinition<CompanyRow>[] = [
  { id: "name", header: "Empresa", accessor: (row) => row.name, width: 220 },
  { id: "country", header: "País", accessor: (row) => row.country },
  { id: "status", header: "Estado", accessor: (row) => row.status },
  { id: "revenue", header: "Ingresos", accessor: (row) => row.revenue, type: "number" },
  { id: "createdAt", header: "Alta", accessor: (row) => row.createdAt },
];

const MINIMUM_WIDTHS: Record<string, number> = { name: 220, country: 120, status: 120, revenue: 120, createdAt: 120, _actions: 56 };
const ROW_ACTIONS = { onEdit: () => undefined };

const renderTable = () =>
  render(<DataTable columns={COLUMNS} data={ROWS} getRowId={(row) => row.id} rowActions={ROW_ACTIONS} />).container;

const readHeaderWidths = (container: HTMLElement) =>
  Object.fromEntries(
    [...container.querySelectorAll<HTMLElement>("thead th")].map((cell) => [cell.dataset.columnId, measureBox(cell).width]),
  );

const readOverflow = (element: Element) => element.scrollWidth - element.clientWidth;

test.each(["iphone14Pro", "pixel7"] as ScreenName[])(
  "on %s no column is narrower than its minimum and only the rows scroll sideways",
  async (screen) => {
    await applyScreen(screen);
    const container = renderTable();
    const widths = readHeaderWidths(container);
    Object.entries(MINIMUM_WIDTHS).forEach(([columnId, minimum]) => expect(widths[columnId]).toBeGreaterThanOrEqual(minimum));
    expect(readOverflow(findRequiredElement(container, ".gdy-table-wrap"))).toBeGreaterThan(0);
    expect(readOverflow(document.documentElement)).toBeLessThanOrEqual(0);
  },
);

test("on a desktop the actions column keeps 56px and the columns without width share the rest", async () => {
  await applyScreen("desktop");
  const container = renderTable();
  const widths = readHeaderWidths(container);
  expect(widths._actions).toBe(56);
  expect(new Set(["country", "status", "revenue", "createdAt"].map((columnId) => widths[columnId])).size).toBe(1);
  expect(widths.country).toBeGreaterThan(120);
  expect(readOverflow(findRequiredElement(container, ".gdy-table-wrap"))).toBeLessThanOrEqual(0);
});

test("the actions button stays inside its column on a phone", async () => {
  await applyScreen("iphone14Pro");
  const container = renderTable();
  const cell = measureBox(findRequiredElement(container, 'td[data-column-id="_actions"]'));
  const button = measureBox(findRequiredElement(container, 'td[data-column-id="_actions"] button'));
  expect(button.left).toBeGreaterThanOrEqual(cell.left);
  expect(button.right).toBeLessThanOrEqual(cell.right);
});

test("the two rules of the migration guide bring back the 1.x layout", async () => {
  await applyScreen("desktop");
  const legacyLayout = document.createElement("style");
  legacyLayout.textContent =
    '.gdy-table-grid { min-width: 0; } .gdy-table-head-cell[data-column-id="_actions"] { width: auto; }';
  document.head.append(legacyLayout);
  const widths = readHeaderWidths(renderTable());
  legacyLayout.remove();
  expect(new Set(["country", "status", "revenue", "createdAt", "_actions"].map((columnId) => widths[columnId])).size).toBe(1);
});
