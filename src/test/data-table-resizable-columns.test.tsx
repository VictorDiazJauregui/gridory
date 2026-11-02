import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { DataTable, type ColumnDefinition, type DataTableProps } from "../components/table";
import {
  clampWidth,
  DEFAULT_MIN_COLUMN_WIDTH,
  MAX_COLUMN_WIDTH,
  resolveWidthLimits,
  withColumnWidth,
  withoutColumnWidth,
} from "../components/table/columns/column-widths";
import { BASELINE_ROW_ACTIONS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type Column = ColumnDefinition<BaselineRow>;
type Props = Partial<DataTableProps<BaselineRow>>;

const COLUMNS: Column[] = [
  { id: "name", header: "Empresa", accessor: (row) => row.name, sortable: true, width: 180 },
  { id: "country", header: "País", accessor: (row) => row.country, filterable: true, width: 120 },
  { id: "status", header: "Estado", accessor: (row) => row.status },
  { id: "notes", header: "Notas", accessor: (row) => row.name, width: 100, resizable: false },
];

const renderTable = (props: Props = {}) =>
  render(<DataTable columns={COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />).container;

const renderResizable = (props: Props = {}) => renderTable({ resizableColumns: true, ...props });

const handleOf = (header: string) => screen.getByRole("separator", { name: `Cambiar el ancho de ${header}` });
const headerCell = (container: HTMLElement, id: string) =>
  container.querySelector(`thead th[data-column-id="${id}"]`) as HTMLElement;
const columnWidthOf = (container: HTMLElement, id: string) =>
  headerCell(container, id).style.getPropertyValue("--gdy-table-column-width");
const grid = (container: HTMLElement) => container.querySelector(".gdy-table-grid") as HTMLElement;
const wrap = (container: HTMLElement) => container.querySelector(".gdy-table-wrap") as HTMLElement;

const pressArrow = (handle: HTMLElement, key: "ArrowLeft" | "ArrowRight", times = 1) => {
  for (let index = 0; index < times; index += 1) fireEvent.keyDown(handle, { key, repeat: index > 0 });
  fireEvent.keyUp(handle, { key });
};

interface DragPath {
  fromX: number;
  toX: number;
  steps?: number;
}

const drag = (handle: HTMLElement, { fromX, toX, steps = 20 }: DragPath) => {
  fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: fromX });
  for (let step = 1; step <= steps; step += 1) {
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: fromX + ((toX - fromX) * step) / steps });
  }
  fireEvent.pointerUp(handle, { pointerId: 1, clientX: toX });
};

afterEach(() => {
  vi.restoreAllMocks();
});

// Each render takes new React ids; the markup is compared without them.
const withoutGeneratedIds = (markup: string) => markup.replace(/«r\w+»|:r\w+:/g, "«id»");

test("without resizableColumns there is no handle and the markup does not change, even with columnWidths", () => {
  const plain = withoutGeneratedIds(renderTable().innerHTML);
  const withWidths = withoutGeneratedIds(
    renderTable({ columnWidths: { name: 300 }, defaultColumnWidths: { country: 90 } }).innerHTML,
  );
  expect(withWidths).toBe(plain);
  expect(document.querySelector(".gdy-table-resize-handle, [data-resized], [data-resizing]")).toBeNull();
});

test("each data column gets a handle except resizable: false and the table's own columns", () => {
  const container = renderResizable({
    rowSelection: {},
    renderExpandedRow: (row) => row.name,
    rowActions: BASELINE_ROW_ACTIONS,
  });
  const owners = [...container.querySelectorAll(".gdy-table-resize-handle")].map((handle) =>
    handle.closest("th")?.getAttribute("data-column-id"),
  );
  expect(owners).toEqual(["name", "country", "status"]);
});

test("the handle is a focusable vertical separator whose value is the width in px", () => {
  renderResizable();
  const handle = handleOf("Empresa");
  expect(handle).toHaveClass("gdy-table-resize-handle");
  expect(handle).toHaveAttribute("aria-orientation", "vertical");
  expect(handle).toHaveAttribute("aria-valuenow", "180");
  expect(handle).toHaveAttribute("aria-valuemin", String(DEFAULT_MIN_COLUMN_WIDTH));
  expect(handle).toHaveAttribute("aria-valuemax", String(MAX_COLUMN_WIDTH));
  expect(handle).toHaveAttribute("tabindex", "0");
});

test("the accessible name comes from labels.resizeColumn", () => {
  renderResizable({ labels: { resizeColumn: (header) => `Resize ${header}` } });
  expect(screen.getByRole("separator", { name: "Resize Empresa" })).toBeInTheDocument();
});

test("the spoken value carries the unit, from labels.resizeColumnValue, and follows the width", () => {
  renderResizable();
  expect(handleOf("Empresa")).toHaveAttribute("aria-valuetext", "180 px");
  pressArrow(handleOf("Empresa"), "ArrowRight");
  expect(handleOf("Empresa")).toHaveAttribute("aria-valuetext", "190 px");
});

test("labels.resizeColumnValue rewrites the spoken value", () => {
  renderResizable({ labels: { resizeColumnValue: (width) => `${width} pixels` } });
  expect(handleOf("Empresa")).toHaveAttribute("aria-valuetext", "180 pixels");
});

test("the arrows move the edge 10px and the release reports only the columns the user resized", () => {
  const onColumnWidthsChange = vi.fn();
  const container = renderResizable({ onColumnWidthsChange });
  pressArrow(handleOf("Empresa"), "ArrowRight", 3);
  expect(onColumnWidthsChange).toHaveBeenCalledOnce();
  expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 210 });
  expect(handleOf("Empresa")).toHaveAttribute("aria-valuenow", "210");
  expect(columnWidthOf(container, "name")).toBe("210px");
  pressArrow(handleOf("País"), "ArrowLeft");
  expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ name: 210, country: 110 });
});

test("holding an arrow reports once, on keyup, and the handle keeps the focus", () => {
  const onColumnWidthsChange = vi.fn();
  renderResizable({ onColumnWidthsChange });
  const handle = handleOf("Empresa");
  handle.focus();
  for (let index = 0; index < 5; index += 1) fireEvent.keyDown(handle, { key: "ArrowRight", repeat: index > 0 });
  expect(onColumnWidthsChange).not.toHaveBeenCalled();
  expect(handle).toHaveAttribute("aria-valuenow", "230");
  fireEvent.keyUp(handle, { key: "ArrowRight" });
  expect(onColumnWidthsChange).toHaveBeenCalledOnce();
  expect(document.activeElement).toBe(handle);
});

test("a column without width starts from its minimum in jsdom, which measures nothing", () => {
  renderResizable();
  expect(handleOf("Estado")).toHaveAttribute("aria-valuenow", String(DEFAULT_MIN_COLUMN_WIDTH));
});

test("minWidth and maxWidth bound the arrows, and the defaults are 64px and no limit", () => {
  const columns = COLUMNS.map((column) => (column.id === "name" ? { ...column, minWidth: 160, maxWidth: 200 } : column));
  renderResizable({ columns });
  const handle = handleOf("Empresa");
  expect(handle).toHaveAttribute("aria-valuemin", "160");
  expect(handle).toHaveAttribute("aria-valuemax", "200");
  pressArrow(handle, "ArrowRight", 10);
  expect(handle).toHaveAttribute("aria-valuenow", "200");
  pressArrow(handle, "ArrowLeft", 10);
  expect(handle).toHaveAttribute("aria-valuenow", "160");
  pressArrow(handleOf("País"), "ArrowLeft", 20);
  expect(handleOf("País")).toHaveAttribute("aria-valuenow", "64");
});

test("a controlled width out of range is shown within the limits, without reporting a change", () => {
  const onColumnWidthsChange = vi.fn();
  const container = renderResizable({ columnWidths: { name: 10, country: 9000 }, onColumnWidthsChange });
  expect(columnWidthOf(container, "name")).toBe("64px");
  expect(handleOf("País")).toHaveAttribute("aria-valuenow", String(MAX_COLUMN_WIDTH));
  expect(onColumnWidthsChange).not.toHaveBeenCalled();
});

test("controlled: columnWidths wins and a resize only reports", () => {
  const onColumnWidthsChange = vi.fn();
  const container = renderResizable({ columnWidths: { name: 250 }, onColumnWidthsChange });
  expect(grid(container)).toHaveAttribute("data-resized");
  pressArrow(handleOf("Empresa"), "ArrowRight");
  expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 260 });
  expect(columnWidthOf(container, "name")).toBe("250px");
});

test("uncontrolled: defaultColumnWidths only sets the starting widths", () => {
  const container = renderResizable({ defaultColumnWidths: { name: 200 } });
  expect(handleOf("Empresa")).toHaveAttribute("aria-valuenow", "200");
  pressArrow(handleOf("Empresa"), "ArrowRight");
  expect(columnWidthOf(container, "name")).toBe("210px");
});

test("Enter and a double click go back to width, drop the key and return to the shared-out layout", () => {
  const onColumnWidthsChange = vi.fn();
  const container = renderResizable({ defaultColumnWidths: { name: 250, country: 150 }, onColumnWidthsChange });
  fireEvent.keyDown(handleOf("Empresa"), { key: "Enter" });
  expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ country: 150 });
  expect(handleOf("Empresa")).toHaveAttribute("aria-valuenow", "180");
  fireEvent.doubleClick(handleOf("País"));
  expect(onColumnWidthsChange).toHaveBeenLastCalledWith({});
  expect(grid(container)).not.toHaveAttribute("data-resized");
  expect(headerCell(container, "name").style.width).toBe("180px");
});

test("a pointer drag captures the pointer, marks the container and reports once on release", async () => {
  const capture = vi.spyOn(HTMLElement.prototype, "setPointerCapture");
  const onColumnWidthsChange = vi.fn();
  const container = renderResizable({ onColumnWidthsChange });
  const handle = handleOf("Empresa");
  fireEvent.pointerDown(handle, { button: 0, pointerId: 7, clientX: 100 });
  expect(capture).toHaveBeenCalledWith(7);
  fireEvent.pointerMove(handle, { pointerId: 7, clientX: 130 });
  await waitFor(() => expect(wrap(container)).toHaveAttribute("data-resizing"));
  expect(handle).toHaveAttribute("aria-valuenow", "210");
  fireEvent.pointerUp(handle, { pointerId: 7, clientX: 140 });
  expect(onColumnWidthsChange).toHaveBeenCalledOnce();
  expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 220 });
  expect(wrap(container)).not.toHaveAttribute("data-resizing");
});

test("twenty pointer moves report once, and a press without moving reports nothing", () => {
  const onColumnWidthsChange = vi.fn();
  renderResizable({ onColumnWidthsChange });
  drag(handleOf("Empresa"), { fromX: 100, toX: 60 });
  expect(onColumnWidthsChange).toHaveBeenCalledOnce();
  expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 140 });
  drag(handleOf("País"), { fromX: 50, toX: 50, steps: 0 });
  expect(onColumnWidthsChange).toHaveBeenCalledOnce();
});

test("a cancelled pointer commits where the edge was and clears the container flag", async () => {
  const onColumnWidthsChange = vi.fn();
  const container = renderResizable({ onColumnWidthsChange });
  const handle = handleOf("Empresa");
  fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: 100 });
  fireEvent.pointerMove(handle, { pointerId: 1, clientX: 90 });
  await waitFor(() => expect(wrap(container)).toHaveAttribute("data-resizing"));
  fireEvent.pointerCancel(handle, { pointerId: 1 });
  expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 170 });
  expect(wrap(container)).not.toHaveAttribute("data-resizing");
});

test("only the main button starts a drag", () => {
  const onColumnWidthsChange = vi.fn();
  renderResizable({ onColumnWidthsChange });
  const handle = handleOf("Empresa");
  fireEvent.pointerDown(handle, { button: 2, pointerId: 1, clientX: 100 });
  fireEvent.pointerUp(handle, { button: 2, pointerId: 1, clientX: 160 });
  expect(onColumnWidthsChange).not.toHaveBeenCalled();
});

test("using the handle neither sorts, nor opens the filter, nor fires the row", () => {
  const onSortChange = vi.fn();
  const onRowClick = vi.fn();
  renderResizable({ onSortChange, onRowClick });
  fireEvent.click(handleOf("Empresa"));
  drag(handleOf("País"), { fromX: 100, toX: 140 });
  expect(onSortChange).not.toHaveBeenCalled();
  expect(onRowClick).not.toHaveBeenCalled();
  expect(document.querySelector(".gdy-table-menu-holder")).toBeNull();
});

test("resized, every header carries its width and the grid their sum; the declared width stays for paper", () => {
  const container = renderResizable({ defaultColumnWidths: { name: 200 }, rowActions: { ...BASELINE_ROW_ACTIONS, columnLabel: "Acciones" } });
  expect(headerCell(container, "name").style.width).toBe("");
  expect(columnWidthOf(container, "name")).toBe("200px");
  expect(headerCell(container, "name").style.getPropertyValue("--gdy-table-column-print-width")).toBe("180px");
  expect(headerCell(container, "status").style.getPropertyValue("--gdy-table-column-print-width")).toBe("");
  expect(columnWidthOf(container, "_actions")).toBe("96px");
  expect(grid(container).style.getPropertyValue("--gdy-table-grid-width")).toBe(`${200 + 120 + 64 + 100 + 96}px`);
  expect(container.querySelector("td[style*='--gdy-table-column-width']")).toBeNull();
});

test("resizing a pinned column moves the offsets of the pinned columns after it", () => {
  const columns = COLUMNS.map((column) => (column.id === "notes" ? column : { ...column, pin: undefined }));
  const pinned = [{ ...columns[0], pin: "left" as const }, { ...columns[1], pin: "left" as const }, ...columns.slice(2)];
  const container = renderResizable({ columns: pinned, defaultColumnWidths: { name: 230 } });
  expect(headerCell(container, "country").style.getPropertyValue("--gdy-table-pin-offset")).toBe("230px");
  pressArrow(handleOf("Empresa"), "ArrowLeft", 3);
  expect(headerCell(container, "country").style.getPropertyValue("--gdy-table-pin-offset")).toBe("200px");
});

test("the width helpers clamp, add and drop without touching an unchanged map", () => {
  expect(resolveWidthLimits()).toEqual({ min: 64, max: MAX_COLUMN_WIDTH });
  expect(resolveWidthLimits({ ...COLUMNS[0], minWidth: 300, maxWidth: 100 })).toEqual({ min: 300, max: 300 });
  expect(clampWidth(12.6, { min: 10, max: 20 })).toBe(13);
  const widths = { name: 200 };
  expect(withColumnWidth(widths, "name", 200)).toBe(widths);
  expect(withColumnWidth(widths, "country", 90)).toEqual({ name: 200, country: 90 });
  expect(withoutColumnWidth(widths, "country")).toBe(widths);
  expect(withoutColumnWidth(widths, "name")).toEqual({});
});
