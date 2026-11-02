import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { DataTable, type ColumnDefinition, type DataTableProps } from "../components/table";
import { resolvePriorityHiddenColumns } from "../components/table/columns/priority-columns";
import { BASELINE_ROW_ACTIONS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

const COLUMNS: ColumnDefinition<BaselineRow>[] = [
  { id: "name", header: "Empresa", accessor: (row) => row.name, width: 200, footer: () => "Total" },
  { id: "country", header: "País", accessor: (row) => row.country, width: 150, filterable: true, priority: 2 },
  { id: "status", header: "Estado", accessor: (row) => row.status, width: 150, hideable: true },
];

type Props = Partial<DataTableProps<BaselineRow>>;

const renderTable = (props: Props = {}) =>
  render(<DataTable columns={COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />);

const headerIds = (container: HTMLElement) =>
  [...container.querySelectorAll("th")].map((cell) => cell.getAttribute("data-column-id"));

const hiddenByPriority = (container: HTMLElement) =>
  [...container.querySelectorAll('th[data-hidden-by="priority"]')].map((cell) => cell.getAttribute("data-column-id"));

interface FakeObserver {
  callback: ResizeObserverCallback;
  disconnect: ReturnType<typeof vi.fn>;
}

let observers: FakeObserver[];
let wrapWidth: number;
let frames: FrameRequestCallback[];

const flushFrames = () =>
  act(() => {
    const pending = frames;
    frames = [];
    pending.forEach((frame) => frame(0));
  });

const resizeTo = (width: number) => {
  wrapWidth = width;
  act(() => observers.forEach((observer) => observer.callback([], {} as ResizeObserver)));
  flushFrames();
};

class RecordingResizeObserver {
  disconnect = vi.fn();
  observe = vi.fn();
  constructor(callback: ResizeObserverCallback) {
    observers.push({ callback, disconnect: this.disconnect });
  }
}

beforeEach(() => {
  observers = [];
  frames = [];
  wrapWidth = 1000;
  vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
  vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => frames.push(frame));
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    frames[id - 1] = () => {};
  });
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
    return this.classList.contains("gdy-table-wrap") ? wrapWidth : 0;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test("columnVisibility false takes the column out of the header, the rows and the totals row", () => {
  const { container } = renderTable({ columnVisibility: { country: false } });
  expect(headerIds(container)).toEqual(["name", "status"]);
  expect(container.querySelector('td[data-column-id="country"]')).toBeNull();
  expect(container.querySelectorAll(".gdy-table-foot-cell")).toHaveLength(2);
});

test("group, empty and loading rows span only the columns on screen", () => {
  const grouped = renderTable({ columnVisibility: { country: false }, groupableColumnIds: ["status"], defaultGroupBy: "status" });
  expect(grouped.container.querySelector(".gdy-table-group-cell")).toHaveAttribute("colspan", "1");
  const empty = render(<DataTable columns={COLUMNS} data={[]} columnVisibility={{ status: false }} />);
  expect(empty.container.querySelector(".gdy-empty")).toHaveAttribute("colspan", "2");
  const loading = renderTable({ columnVisibility: { status: false }, loading: true, renderLoading: () => "…" });
  expect(loading.container.querySelector(".gdy-table-loading-row td")).toHaveAttribute("colspan", "2");
  const skeleton = renderTable({ columnVisibility: { status: false }, loading: true });
  expect(skeleton.container.querySelector('.gdy-table-skeleton[data-column-id="status"]')).toBeNull();
});

test("without the new props the colSpan still counts every column, actions included", () => {
  const { container } = render(<DataTable columns={COLUMNS} data={[]} rowActions={BASELINE_ROW_ACTIONS} />);
  expect(container.querySelector(".gdy-empty")).toHaveAttribute("colspan", "4");
});

test("onColumnVisibilityChange reports on mount and on each change, never twice for the same columns", () => {
  const onChange = vi.fn();
  const { rerender } = renderTable({ onColumnVisibilityChange: onChange });
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenLastCalledWith({ name: true, country: true, status: true }, { hiddenByPriority: [] });
  const next = { status: false };
  rerender(<DataTable columns={COLUMNS} data={BASELINE_ROWS} columnVisibility={next} onColumnVisibilityChange={onChange} />);
  rerender(<DataTable columns={COLUMNS} data={BASELINE_ROWS} columnVisibility={{ ...next }} onColumnVisibilityChange={onChange} />);
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(onChange).toHaveBeenLastCalledWith({ name: true, country: true, status: false }, { hiddenByPriority: [] });
});

test("without responsiveColumns no observer is created and nothing hides", () => {
  wrapWidth = 100;
  const { container } = renderTable();
  expect(observers).toHaveLength(0);
  expect(hiddenByPriority(container)).toEqual([]);
});

test("responsiveColumns hides the unnumbered hideable column first, then by priority, and brings them back", () => {
  const onChange = vi.fn();
  wrapWidth = 400;
  const { container } = renderTable({ responsiveColumns: true, onColumnVisibilityChange: onChange });
  expect(hiddenByPriority(container)).toEqual(["status"]);
  expect(container.querySelector('td[data-column-id="status"]')).toHaveAttribute("data-hidden-by", "priority");
  expect(onChange).toHaveBeenLastCalledWith({ name: true, country: true, status: false }, { hiddenByPriority: ["status"] });
  resizeTo(250);
  expect(hiddenByPriority(container)).toEqual(["country", "status"]);
  resizeTo(1000);
  expect(hiddenByPriority(container)).toEqual([]);
});

test("the app wins: columnVisibility true pins a column and false removes it before the priority counts", () => {
  wrapWidth = 400;
  const { container } = renderTable({ responsiveColumns: true, columnVisibility: { status: true } });
  expect(hiddenByPriority(container)).toEqual(["country"]);
  expect(container.querySelector('th[data-column-id="status"]')).not.toHaveAttribute("data-hidden-by");
});

test("several resizes in one frame calculate once; unmounting disconnects the observer", () => {
  wrapWidth = 1000;
  const { container, unmount } = renderTable({ responsiveColumns: true });
  wrapWidth = 250;
  act(() => {
    observers[0].callback([], {} as ResizeObserver);
    observers[0].callback([], {} as ResizeObserver);
  });
  expect(frames).toHaveLength(2);
  flushFrames();
  expect(hiddenByPriority(container)).toEqual(["country", "status"]);
  unmount();
  expect(observers[0].disconnect).toHaveBeenCalled();
});

test("an open filter panel closes when the priority hides its column", () => {
  wrapWidth = 1000;
  renderTable({ responsiveColumns: true });
  fireEvent.click(screen.getByRole("button", { name: "País" }));
  expect(document.querySelector(".gdy-table-menu-holder")).not.toBeNull();
  resizeTo(250);
  expect(document.querySelector(".gdy-table-menu-holder")).toBeNull();
});

test("the priority calculation: order, ties, internal columns and no room at all", () => {
  const columns = [
    { id: "_select", width: 44, hideable: false },
    { id: "a", width: 100, hideable: true, priority: 1 },
    { id: "b", width: 100, hideable: true },
    { id: "c", width: 100, hideable: true, priority: 1 },
    { id: "d", width: 100, hideable: true },
    { id: "e", width: 100, hideable: false },
    { id: "_actions", width: 56, hideable: false },
  ];
  expect(resolvePriorityHiddenColumns(columns, 600)).toEqual([]);
  expect(resolvePriorityHiddenColumns(columns, 500)).toEqual(["d"]);
  expect(resolvePriorityHiddenColumns(columns, 300)).toEqual(["d", "b", "c"]);
  expect(resolvePriorityHiddenColumns(columns, 0)).toEqual(["d", "b", "c", "a"]);
});
