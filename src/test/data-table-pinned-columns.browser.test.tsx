import { render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { DataTable, type ColumnDefinition, type DataTableProps } from "../components/table";
import { BASELINE_ROW_ACTIONS, type BaselineRow } from "./baseline-fixture";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, applyTheme, type Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";
import { emulateMediaType } from "./browser/print-media";

afterEach(async () => {
  applyTheme("light");
  await applyScreen("desktop");
  await emulateMediaType("screen");
});

const ROWS: BaselineRow[] = Array.from({ length: 30 }, (_, index) => ({
  id: `r${index + 1}`,
  name: `Empresa ${index + 1}`,
  country: index % 2 === 0 ? "Perú" : "Chile",
  status: index % 3 === 0 ? "Archivada" : "Activa",
}));

const wideColumn = (id: string, extra: Partial<ColumnDefinition<BaselineRow>> = {}): ColumnDefinition<BaselineRow> => ({
  id,
  header: id,
  accessor: (row) => `${row.country} ${id}`,
  width: 300,
  ...extra,
});

const COLUMNS: ColumnDefinition<BaselineRow>[] = [
  { id: "name", header: "Empresa", accessor: (row) => row.name, width: 180, pin: "left", filterable: true },
  wideColumn("country", { accessor: (row) => row.country, filterable: true }),
  wideColumn("c2"),
  wideColumn("c3"),
  wideColumn("c4"),
  { id: "status", header: "Estado", accessor: (row) => row.status, width: 140, pin: "right", footer: () => "Total" },
];

const renderTable = (props: Partial<DataTableProps<BaselineRow>> = {}, width = 1000) =>
  render(
    <div style={{ width }}>
      <DataTable
        columns={COLUMNS}
        data={ROWS}
        getRowId={(row) => row.id}
        defaultPageSize={25}
        tableMaxHeightClassName="gdy-table-max-h-sm"
        {...props}
      />
    </div>,
  ).container;

const wrapOf = (container: HTMLElement) => findRequiredElement(container, ".gdy-table-wrap") as HTMLElement;
const cellOf = (root: ParentNode, selector: string) => findRequiredElement(root, selector) as HTMLElement;
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

const scrollWrap = async (wrap: HTMLElement, left: number, top = 0) => {
  wrap.scrollLeft = left;
  wrap.scrollTop = top;
  wrap.dispatchEvent(new Event("scroll"));
  await nextFrame();
};

const elementAtCenterOf = (element: Element) => {
  const box = measureBox(element);
  return document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
};

const readEdgeShadows = (container: HTMLElement) =>
  ['td[data-column-id="name"]', 'td[data-column-id="status"]'].map((selector) =>
    readStyle(cellOf(container, `[data-row-id="r1"] ${selector}`), "opacity", "::after"),
  );

test.each(["light", "dark"] as Theme[])("in %s pinned cells stay at their declared offsets while scrolling", async (theme) => {
  applyTheme(theme);
  const container = renderTable({ rowSelection: {}, rowActions: BASELINE_ROW_ACTIONS });
  const wrap = wrapOf(container);
  const wrapLeft = measureBox(wrap).left;
  await scrollWrap(wrap, 400);
  const name = cellOf(container, '[data-row-id="r1"] td[data-column-id="name"]');
  expect(measureBox(name).left).toBe(wrapLeft + 44);
  expect(measureBox(cellOf(container, '[data-row-id="r1"] td[data-column-id="status"]')).right).toBe(
    wrapLeft + wrap.clientWidth - 56,
  );
  expect(readStyle(name, "background-color")).not.toBe("rgba(0, 0, 0, 0)");
});

test.each(["light", "dark"] as Theme[])("in %s a pinned cell repaints its bottom border once, in line", (theme) => {
  applyTheme(theme);
  const container = renderTable();
  const pinned = cellOf(container, '[data-row-id="r1"] td[data-column-id="name"]');
  const plain = cellOf(container, '[data-row-id="r1"] td[data-column-id="country"]');
  expect(readStyle(pinned, "border-bottom-style")).toBe("none");
  expect(readStyle(pinned, "box-shadow")).toContain(readStyle(plain, "border-bottom-color"));
  expect([measureBox(pinned).top, measureBox(pinned).bottom]).toEqual([measureBox(plain).top, measureBox(plain).bottom]);
});

test("the edge shadow shows only on the side with content scrolled under it", async () => {
  const container = renderTable();
  const wrap = wrapOf(container);
  await nextFrame();
  expect(readEdgeShadows(container)).toEqual(["0", "1"]);
  await scrollWrap(wrap, 200);
  expect(readEdgeShadows(container)).toEqual(["1", "1"]);
  await scrollWrap(wrap, wrap.scrollWidth);
  expect(readEdgeShadows(container)).toEqual(["1", "0"]);
});

test("with the sticky header, the pinned header and totals cells cover both scroll directions", async () => {
  const container = renderTable();
  await scrollWrap(wrapOf(container), 400, 300);
  const corner = cellOf(container, 'thead th[data-column-id="name"]');
  expect(elementAtCenterOf(corner)?.closest("th")).toBe(corner);
  const footCorner = cellOf(container, 'tfoot td[data-column-id="status"]');
  expect(elementAtCenterOf(footCorner)?.closest("td")).toBe(footCorner);
  const plainHeader = cellOf(container, 'thead th[data-column-id="c2"]');
  expect(Number(readStyle(corner, "z-index"))).toBeGreaterThan(Number(readStyle(plainHeader, "z-index")));
});

test("a group row label stays at the left edge while the rows scroll sideways", async () => {
  const container = renderTable({ groupableColumnIds: ["country"], defaultGroupBy: "country" });
  const wrap = wrapOf(container);
  await scrollWrap(wrap, 400);
  const toggle = measureBox(cellOf(container, ".gdy-table-group-toggle"));
  expect([toggle.left, toggle.width]).toEqual([measureBox(wrap).left, wrap.clientWidth]);
});

test("a filter panel opened next to the pinned column stays over it", async () => {
  const container = renderTable();
  await scrollWrap(wrapOf(container), 120);
  await userEvent.click(findRequiredElement(container, 'th[data-column-id="country"] .gdy-table-head-trigger'));
  await expect.poll(() => container.querySelector(".gdy-table-menu-holder .gdy-panel")).not.toBeNull();
  const panel = cellOf(container, ".gdy-table-menu-holder .gdy-panel");
  const pinned = measureBox(cellOf(container, 'thead th[data-column-id="name"]'));
  const point = { x: pinned.right - 4, y: measureBox(panel).top + 12 };
  expect(measureBox(panel).left).toBeLessThan(point.x);
  expect(panel.contains(document.elementFromPoint(point.x, point.y))).toBe(true);
});

test("the focus ring of a row shows over its pinned cells", () => {
  const container = renderTable({ onRowClick: () => undefined, focusableRows: true });
  cellOf(container, '[data-row-id="r1"]').focus({ focusVisible: true } as FocusOptions);
  const shadow = readStyle(cellOf(container, '[data-row-id="r1"] td[data-column-id="name"]'), "box-shadow");
  expect(shadow).toContain("2px");
});

test("the row menu opens over the pinned columns", async () => {
  const container = renderTable({ rowActions: BASELINE_ROW_ACTIONS });
  await userEvent.click(findRequiredElement(container, '[data-row-id="r1"] button[aria-label="Opciones"]'));
  await expect.poll(() => document.querySelector('[role="menu"]')).not.toBeNull();
  const menu = cellOf(document, '[role="menu"]');
  expect(menu.contains(elementAtCenterOf(menu))).toBe(true);
});

test("pins wider than half the container let go and scroll with the rest", async () => {
  const container = renderTable({ rowSelection: {}, rowActions: BASELINE_ROW_ACTIONS }, 600);
  await nextFrame();
  expect(wrapOf(container)).toHaveAttribute("data-pinning-suspended");
  expect(readStyle(cellOf(container, '[data-row-id="r1"] td[data-column-id="name"]'), "position")).toBe("static");
});

test("on an iPhone 14 Pro and a Pixel 7, narrow pins stay while the rows scroll", async () => {
  const columns = COLUMNS.map((column) => (column.id === "name" ? { ...column, width: 120 } : { ...column, pin: undefined }));
  for (const screenName of ["iphone14Pro", "pixel7"] as const) {
    await applyScreen(screenName);
    const container = renderTable({ columns }, 360);
    const wrap = wrapOf(container);
    await scrollWrap(wrap, 300);
    expect(wrap).not.toHaveAttribute("data-pinning-suspended");
    expect(measureBox(cellOf(container, '[data-row-id="r1"] td[data-column-id="name"]')).left).toBe(measureBox(wrap).left);
  }
});

test("printing turns pinned columns into ordinary ones", async () => {
  const container = renderTable();
  await emulateMediaType("print");
  const name = cellOf(container, '[data-row-id="r1"] td[data-column-id="name"]');
  expect(readStyle(name, "position")).toBe("static");
  expect(readStyle(name, "content", "::after")).toBe("none");
});

const renderNestedDetail = (row: BaselineRow) => (
  <DataTable
    columns={[{ id: "name", header: "Contacto", accessor: () => row.name, width: 200 }]}
    data={[row]}
    getRowId={(item) => item.id}
    features={{ search: false, pagination: false }}
    tableMinHeightClassName=""
  />
);

const renderCrossTable = () =>
  renderTable(
    { rowSelection: {}, rowActions: BASELINE_ROW_ACTIONS, renderExpandedRow: renderNestedDetail, defaultExpandedRowIds: ["r1"] },
    1100,
  );

test("with expanded rows, the checkbox, expand and pinned columns stay put and the detail spans the visible width", async () => {
  const container = renderCrossTable();
  const wrap = wrapOf(container);
  const wrapLeft = measureBox(wrap).left;
  await scrollWrap(wrap, 500);
  expect(measureBox(cellOf(container, '[data-row-id="r1"] td[data-column-id="_expand"]')).left).toBe(wrapLeft + 44);
  expect(measureBox(cellOf(container, '[data-row-id="r1"] td[data-column-id="name"]')).left).toBe(wrapLeft + 84);
  const panel = measureBox(cellOf(container, ".gdy-table-expanded-panel"));
  expect([panel.left, panel.width]).toEqual([wrapLeft, wrap.clientWidth]);
});

test("with expanded rows, the sticky header covers the detail while scrolling down, and the corner covers everything", async () => {
  const container = renderCrossTable();
  const wrap = wrapOf(container);
  const detailTop = measureBox(cellOf(container, ".gdy-table-expanded-cell")).top;
  await scrollWrap(wrap, 300, detailTop - measureBox(wrap).top - 10);
  const header = cellOf(container, 'thead th[data-column-id="c2"]');
  expect(elementAtCenterOf(header)?.closest("th")).toBe(header);
  const corner = cellOf(container, 'thead th[data-column-id="name"]');
  expect(elementAtCenterOf(corner)?.closest("th")).toBe(corner);
});

test("with expanded rows, a table nested in the detail inherits none of the pinned rules", () => {
  const nested = cellOf(renderCrossTable(), ".gdy-table-expanded-body .gdy-table");
  expect(nested.querySelector("[data-pinned], [data-has-pinned]")).toBeNull();
  const nestedCell = cellOf(nested, "td[data-column-id='name']");
  expect(readStyle(nestedCell, "position")).toBe("static");
  expect(readStyle(nestedCell, "box-shadow")).toBe("none");
});
