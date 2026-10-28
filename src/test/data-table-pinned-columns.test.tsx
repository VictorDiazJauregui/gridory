import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable, PinnedColumnWidthError, type ColumnDefinition, type DataTableProps } from "../components/table";
import { orderByPin, resolvePinnedColumns } from "../components/table/columns/pinned-columns";
import { BASELINE_ROW_ACTIONS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { expectRenderError } from "./expect-render-error";

type Column = ColumnDefinition<BaselineRow>;

const column = (id: string, extra: Partial<Column> = {}): Column => ({
  id,
  header: id,
  accessor: (row) => row.name,
  width: 100,
  ...extra,
});

const COLUMNS: Column[] = [
  column("a"),
  column("b", { pin: "right", width: 120 }),
  column("c", { pin: "left", width: 150 }),
  column("d"),
  column("e", { pin: "left", width: 90 }),
];

const UNPINNED_COLUMNS: Column[] = COLUMNS.map((item) => ({ ...item, pin: undefined }));

const renderTable = (props: Partial<DataTableProps<BaselineRow>> = {}) =>
  render(<DataTable columns={COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />).container;

const headerIds = (container: HTMLElement) =>
  [...container.querySelectorAll("thead th")].map((cell) => cell.getAttribute("data-column-id"));

const headerCell = (container: HTMLElement, id: string) =>
  container.querySelector(`thead th[data-column-id="${id}"]`) as HTMLElement;

const offsetOf = (cell: Element | null) => (cell as HTMLElement | null)?.style.getPropertyValue("--gdy-table-pin-offset");

test("without pin the markup has no pinned attribute, offset or container flag", () => {
  const container = renderTable({ columns: UNPINNED_COLUMNS });
  expect(container.querySelector("[data-pinned], [data-pinned-edge], [data-has-pinned]")).toBeNull();
  expect(container.querySelector("td[style], tfoot td[style]")).toBeNull();
  expect(headerIds(container)).toEqual(["a", "b", "c", "d", "e"]);
});

test("pinned columns move to their edge, each side in declaration order", () => {
  expect(headerIds(renderTable())).toEqual(["c", "e", "a", "d", "b"]);
});

test("each pinned cell carries its side and its offset from that edge, and the last one of a side is the edge", () => {
  const container = renderTable();
  expect(container.querySelector(".gdy-table-wrap")).toHaveAttribute("data-has-pinned");
  expect(headerCell(container, "c")).toHaveAttribute("data-pinned", "left");
  expect(offsetOf(headerCell(container, "c"))).toBe("0px");
  expect(headerCell(container, "c")).not.toHaveAttribute("data-pinned-edge");
  expect(offsetOf(headerCell(container, "e"))).toBe("150px");
  expect(headerCell(container, "e")).toHaveAttribute("data-pinned-edge");
  expect(headerCell(container, "b")).toHaveAttribute("data-pinned", "right");
  expect(offsetOf(headerCell(container, "b"))).toBe("0px");
  expect(headerCell(container, "a")).not.toHaveAttribute("data-pinned");
  expect(headerCell(container, "c").style.width).toBe("150px");
});

test("body, totals and loading cells carry the same pin as their header", () => {
  const columns = COLUMNS.map((item) => (item.id === "e" ? { ...item, footer: () => "Total" } : item));
  const container = renderTable({ columns });
  const bodyCell = container.querySelector('[data-row-id="b1"] td[data-column-id="e"]');
  expect(bodyCell).toHaveAttribute("data-pinned", "left");
  expect(offsetOf(bodyCell)).toBe("150px");
  expect(container.querySelector('tfoot td[data-column-id="e"]')).toHaveAttribute("data-pinned-edge");
  const loading = renderTable({ columns, loading: true });
  expect(offsetOf(loading.querySelector('.gdy-table-skeleton[data-column-id="e"]'))).toBe("150px");
});

test("a pinned column without width throws PinnedColumnWidthError", () => {
  expectRenderError(
    <DataTable columns={[column("a", { pin: "left", width: undefined })]} data={BASELINE_ROWS} />,
    PinnedColumnWidthError,
  );
});

test("with a left pin the checkbox and expand columns stick first, and the offsets count them", () => {
  const container = renderTable({ rowSelection: {}, renderExpandedRow: (row) => row.name });
  expect(headerIds(container).slice(0, 4)).toEqual(["_select", "_expand", "c", "e"]);
  expect(offsetOf(headerCell(container, "_expand"))).toBe("44px");
  expect(offsetOf(headerCell(container, "c"))).toBe("84px");
  expect(headerCell(container, "e")).toHaveAttribute("data-pinned-edge");
});

test("with a right pin the actions column sticks last, 56px wide, and the right offsets count it", () => {
  const container = renderTable({ rowActions: BASELINE_ROW_ACTIONS });
  const actions = headerCell(container, "_actions");
  expect(actions).toHaveAttribute("data-pinned", "right");
  expect(actions.style.width).toBe("56px");
  expect(offsetOf(headerCell(container, "b"))).toBe("56px");
  expect(headerCell(container, "b")).toHaveAttribute("data-pinned-edge");
});

test("rowActions.pinned pins only the actions column, 96px wide with a columnLabel", () => {
  const container = renderTable({
    columns: UNPINNED_COLUMNS,
    rowActions: { ...BASELINE_ROW_ACTIONS, pinned: true, columnLabel: "Acciones" },
  });
  expect(container.querySelectorAll("thead [data-pinned]")).toHaveLength(1);
  const actions = headerCell(container, "_actions");
  expect(actions).toHaveAttribute("data-pinned-edge");
  expect(actions.style.width).toBe("96px");
});

test("without a pin the actions header keeps no width, as before", () => {
  const container = renderTable({ columns: UNPINNED_COLUMNS, rowActions: { ...BASELINE_ROW_ACTIONS, columnLabel: "Acciones" } });
  expect(headerCell(container, "_actions")).not.toHaveAttribute("style");
});

test("a pinned column hidden by the app or grouped leaves the offsets to the rest", () => {
  const hidden = renderTable({ columnVisibility: { c: false } });
  expect(offsetOf(headerCell(hidden, "e"))).toBe("0px");
  const grouped = renderTable({ groupableColumnIds: ["c"], defaultGroupBy: "c" });
  expect(headerCell(grouped, "c")).toBeNull();
  expect(offsetOf(headerCell(grouped, "e"))).toBe("0px");
});

test("a pinned column never hides by priority", () => {
  const columns = COLUMNS.map((item) => ({ ...item, priority: 1 }));
  const container = renderTable({ columns, responsiveColumns: true });
  expect(container.querySelector('[data-pinned][data-hidden-by="priority"]')).toBeNull();
});

test("resolvePinnedColumns adds the widths from each edge inward and marks the inner edge", () => {
  const pinned = resolvePinnedColumns([
    { id: "a", width: 40, pin: "left" },
    { id: "b", width: 60, pin: "left" },
    { id: "c", width: 200 },
    { id: "d", width: 70, pin: "right" },
    { id: "e", width: 30, pin: "right" },
  ]);
  expect(pinned?.totalWidth).toBe(200);
  expect(pinned?.placements.get("b")).toEqual({ side: "left", offset: 40, width: 60, isEdge: true });
  expect(pinned?.placements.get("d")).toEqual({ side: "right", offset: 30, width: 70, isEdge: true });
  expect(pinned?.placements.get("e")).toEqual({ side: "right", offset: 0, width: 30, isEdge: false });
  expect(pinned?.placements.has("c")).toBe(false);
  expect(resolvePinnedColumns([{ id: "c", width: 200 }])).toBeNull();
});

test("orderByPin keeps the same array when nothing is pinned", () => {
  const columns = [{ id: "a" }, { id: "b" }];
  expect(orderByPin(columns)).toBe(columns);
});
