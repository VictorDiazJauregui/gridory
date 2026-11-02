import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { DataTable, type ColumnDefinition, type DataTableProps } from "../components/table";
import type { BaselineRow } from "./baseline-fixture";
import { findRequiredElement } from "./browser/elements";
import { applyTheme, type Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";
import { dragPointer } from "./browser/pointer-drag";
import { emulateMediaType } from "./browser/print-media";

type Column = ColumnDefinition<BaselineRow>;
type Props = Partial<DataTableProps<BaselineRow>>;

const ROWS: BaselineRow[] = Array.from({ length: 6 }, (_, index) => ({
  id: `r${index + 1}`,
  name: `Empresa ${index + 1}`,
  country: index % 2 === 0 ? "Perú" : "Chile",
  status: "Activa",
}));

const COLUMNS: Column[] = [
  { id: "name", header: "Empresa", accessor: (row) => row.name, width: 180, footer: () => "Total" },
  { id: "country", header: "País", accessor: (row) => row.country, width: 120, filterable: true },
  { id: "status", header: "Estado", accessor: (row) => row.status, headerTooltip: "Estado de la empresa" },
  { id: "notes", header: "Notas", accessor: (row) => row.name, width: 160 },
];

const renderTable = (props: Props = {}, width = 1000) =>
  render(
    <div style={{ width }}>
      <DataTable columns={COLUMNS} data={ROWS} getRowId={(row) => row.id} resizableColumns {...props} />
    </div>,
  ).container;

const headerOf = (container: HTMLElement, id: string) =>
  findRequiredElement(container, `thead th[data-column-id="${id}"]`) as HTMLElement;
const handleSelector = (id: string) => `th[data-column-id="${id}"] > .gdy-table-resize-handle`;
const headerBoxes = (container: HTMLElement) =>
  Object.fromEntries([...container.querySelectorAll("thead th")].map((cell) => [cell.getAttribute("data-column-id"), measureBox(cell)]));
const elementAtCenterOf = (element: Element) => {
  const box = measureBox(element);
  return document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
};

test.each(["light", "dark"] as Theme[])("in %s the width changes without moving the rest of the layout", async (theme) => {
  applyTheme(theme);
  const container = renderTable({ rowActions: { onEdit: () => {} } });
  const before = headerBoxes(container);
  await dragPointer({ selector: handleSelector("country"), deltaX: 60, steps: 12 });
  const after = headerBoxes(container);
  expect(after.country.width).toBe(before.country.width + 60);
  expect(after.name).toEqual(before.name);
  for (const id of ["status", "notes", "_actions"]) {
    expect(after[id].width).toBe(before[id].width);
    expect(after[id].left).toBe(before[id].left + 60);
  }
  expect(window.getSelection()?.toString()).toBe("");
});

test("the first drag does not jump: every column starts where the browser had laid it out", async () => {
  const container = renderTable();
  const before = headerBoxes(container);
  await dragPointer({ selector: handleSelector("name"), deltaX: 1, steps: 1 });
  await dragPointer({ selector: handleSelector("name"), deltaX: -1, steps: 1 });
  expect(headerBoxes(container)).toEqual(before);
});

test("the drag stops at minWidth", async () => {
  const columns = COLUMNS.map((column) => (column.id === "name" ? { ...column, minWidth: 120 } : column));
  const container = renderTable({ columns });
  await dragPointer({ selector: handleSelector("name"), deltaX: -300, steps: 2 });
  expect(measureBox(headerOf(container, "name")).width).toBe(120);
});

test("the totals, a detail and the loading rows follow the new width", async () => {
  const container = renderTable({ renderExpandedRow: (row) => row.name, defaultExpandedRowIds: ["r1"] });
  await dragPointer({ selector: handleSelector("name"), deltaX: 50, steps: 2 });
  const header = measureBox(headerOf(container, "name"));
  const footCell = measureBox(findRequiredElement(container, 'tfoot td[data-column-id="name"]'));
  expect([footCell.left, footCell.width]).toEqual([header.left, header.width]);
  const grid = measureBox(findRequiredElement(container, ".gdy-table-grid"));
  expect(measureBox(findRequiredElement(container, ".gdy-table-expanded-cell")).width).toBe(grid.width);
});

test("the loading placeholders take the user's widths", () => {
  const container = renderTable({ loading: true, defaultColumnWidths: { name: 260 } });
  const skeleton = measureBox(findRequiredElement(container, 'td.gdy-table-skeleton[data-column-id="name"]'));
  expect(skeleton.width).toBe(260);
});

test("a pinned column pushes the next pinned one, and never grows past half of the container", async () => {
  const pinned = COLUMNS.map((column) => (["name", "country"].includes(column.id) ? { ...column, pin: "left" as const } : column));
  const container = renderTable({ columns: pinned });
  await dragPointer({ selector: handleSelector("name"), deltaX: 40, steps: 2 });
  const name = measureBox(headerOf(container, "name"));
  expect(name.width).toBe(220);
  expect(measureBox(headerOf(container, "country")).left).toBe(name.right);
  await dragPointer({ selector: handleSelector("name"), deltaX: 400, steps: 2 });
  const half = findRequiredElement(container, ".gdy-table-wrap").clientWidth / 2;
  expect(measureBox(headerOf(container, "name")).width + 120).toBe(Math.floor(half));
  expect(findRequiredElement(container, ".gdy-table-wrap")).not.toHaveAttribute("data-pinning-suspended");
});

test("a right-pinned column has its handle on its left edge and grows leftward", async () => {
  const columns = COLUMNS.map((column) => (column.id === "notes" ? { ...column, pin: "right" as const } : column));
  const container = renderTable({ columns }, 600);
  const header = headerOf(container, "notes");
  const handle = findRequiredElement(header, ".gdy-table-resize-handle");
  expect(measureBox(handle).left).toBe(measureBox(header).left);
  await dragPointer({ selector: handleSelector("notes"), deltaX: -30, steps: 2 });
  expect(measureBox(header).width).toBe(190);
});

test("the handle covers neither the title, nor the help, nor the open filter panel", async () => {
  const container = renderTable();
  const trigger = findRequiredElement(headerOf(container, "status"), ".gdy-table-head-trigger");
  const help = findRequiredElement(headerOf(container, "status"), ".gdy-table-head-help");
  expect(trigger.contains(elementAtCenterOf(trigger))).toBe(true);
  expect(help.contains(elementAtCenterOf(help))).toBe(true);
  await userEvent.click(findRequiredElement(headerOf(container, "country"), ".gdy-table-head-trigger"));
  const handle = findRequiredElement(headerOf(container, "country"), ".gdy-table-resize-handle");
  const box = measureBox(handle);
  const panel = measureBox(findRequiredElement(container, ".gdy-table-menu-holder"));
  const covering = document.elementFromPoint(box.left + box.width / 2, panel.top + 4);
  expect(covering?.closest(".gdy-table-menu-holder")).not.toBeNull();
});

test.each(["light", "dark"] as Theme[])("in %s the handle line shows on hover", async (theme) => {
  applyTheme(theme);
  const container = renderTable();
  const handle = findRequiredElement(headerOf(container, "name"), ".gdy-table-resize-handle");
  expect(readStyle(handle, "opacity", "::after")).toBe("0");
  await userEvent.hover(handle);
  expect(readStyle(handle, "opacity", "::after")).toBe("1");
  expect(readStyle(handle, "background-color", "::after")).not.toBe("rgba(0, 0, 0, 0)");
  expect(readStyle(handle, "cursor")).toBe("col-resize");
});

test("on paper the declared widths stand, as without the user's", async () => {
  const plain = renderTable({ resizableColumns: false });
  await emulateMediaType("print");
  const printed = measureBox(headerOf(plain, "name")).width;
  plain.remove();
  const resized = renderTable({ defaultColumnWidths: { name: 320 } });
  expect(measureBox(headerOf(resized, "name")).width).toBe(printed);
});

test("on a resized grid narrower than its container, a detail and a group label end at the grid's edge", () => {
  const container = renderTable({
    defaultColumnWidths: { name: 100 },
    renderExpandedRow: (row) => row.name,
    defaultExpandedRowIds: ["r1"],
    groupableColumnIds: ["country"],
    defaultGroupBy: "country",
  });
  const grid = measureBox(findRequiredElement(container, ".gdy-table-grid"));
  expect(grid.width).toBeLessThan(measureBox(findRequiredElement(container, ".gdy-table-wrap")).width);
  expect(measureBox(findRequiredElement(container, ".gdy-table-expanded-panel")).right).toBeLessThanOrEqual(grid.right);
  expect(measureBox(findRequiredElement(container, ".gdy-table-group-toggle")).right).toBeLessThanOrEqual(grid.right);
});

test("before any resize, the handle of a column without width reports its new width when the container resizes", async () => {
  const container = renderTable();
  const frame = container.firstElementChild as HTMLElement;
  const handle = findRequiredElement(headerOf(container, "status"), ".gdy-table-resize-handle");
  const reportsItsWidth = () =>
    expect(Number(handle.getAttribute("aria-valuenow"))).toBe(Math.round(headerOf(container, "status").getBoundingClientRect().width));
  reportsItsWidth();
  const before = handle.getAttribute("aria-valuenow");
  frame.style.width = "800px";
  await expect.poll(() => handle.getAttribute("aria-valuenow")).not.toBe(before);
  reportsItsWidth();
  expect(handle).toHaveAttribute("aria-valuetext", `${handle.getAttribute("aria-valuenow")} px`);
});
