import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { DataTable, type DataTableProps } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type Listener = (event: MediaQueryListEvent) => void;

// jsdom has no matchMedia: this stand-in lets a test flip the "print" media on and off.
const installPrintMedia = () => {
  const listeners = new Set<Listener>();
  const media = { matches: false };
  vi.stubGlobal("matchMedia", (query: string) => ({
    media: query,
    get matches() {
      return media.matches;
    },
    addEventListener: (_type: string, listener: Listener) => listeners.add(listener),
    removeEventListener: (_type: string, listener: Listener) => listeners.delete(listener),
  }));
  const setPrinting = (matches: boolean) => {
    media.matches = matches;
    act(() => listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent)));
  };
  return { setPrinting };
};

let printMedia: ReturnType<typeof installPrintMedia>;

beforeEach(() => {
  printMedia = installPrintMedia();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const renderTable = (props: Partial<DataTableProps<BaselineRow>> = {}) =>
  render(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />);

const dataRowNames = (container: HTMLElement) =>
  [...container.querySelectorAll("tbody tr.gdy-table-row")].map((row) => row.querySelector("td")?.textContent);

const goToNextPage = (container: HTMLElement) =>
  fireEvent.click([...container.querySelectorAll(".gdy-table-pagination button")].at(-1) as Element);

test("reflects printMode as data-print-mode on the root", () => {
  const { container } = renderTable({ printMode: "page" });
  expect(container.querySelector(".gdy-table")).toHaveAttribute("data-print-mode", "page");
});

test("without printMode the root has no print attribute and printing changes nothing", () => {
  const { container } = renderTable({ defaultPageSize: 2 });
  expect(container.querySelector(".gdy-table")).not.toHaveAttribute("data-print-mode");
  printMedia.setPrinting(true);
  expect(dataRowNames(container)).toHaveLength(2);
});

test('"page" prints the current page only', () => {
  const { container } = renderTable({ printMode: "page", defaultPageSize: 2 });
  printMedia.setPrinting(true);
  expect(dataRowNames(container)).toHaveLength(2);
});

test('"all" renders every filtered row while printing and goes back to the page after', () => {
  const onPaginationChange = vi.fn();
  const onVisibleRowsChange = vi.fn();
  const { container } = renderTable({ printMode: "all", defaultPageSize: 2, onPaginationChange, onVisibleRowsChange });
  goToNextPage(container);
  onPaginationChange.mockClear();
  onVisibleRowsChange.mockClear();
  printMedia.setPrinting(true);
  expect(dataRowNames(container)).toEqual(["Frío Delta", "Pack Norte", "Cold South"]);
  printMedia.setPrinting(false);
  expect(dataRowNames(container)).toEqual(["Cold South"]);
  expect(onPaginationChange).not.toHaveBeenCalled();
  expect(onVisibleRowsChange).not.toHaveBeenCalled();
});

test('"all" prints every group expanded and keeps the collapsed ones for the screen', () => {
  const { container } = renderTable({ printMode: "all", groupableColumnIds: ["status"] });
  fireEvent.click(screen.getByRole("combobox", { name: "Agrupar por" }));
  fireEvent.click(screen.getByRole("option", { name: "Agrupar por: Estado" }));
  fireEvent.click(screen.getByRole("button", { name: /Activa/ }));
  expect(dataRowNames(container)).toEqual(["Pack Norte"]);
  printMedia.setPrinting(true);
  expect(dataRowNames(container)).toEqual(["Frío Delta", "Cold South", "Pack Norte"]);
  printMedia.setPrinting(false);
  expect(dataRowNames(container)).toEqual(["Pack Norte"]);
  expect(screen.getByRole("button", { name: /Activa/ })).toHaveAttribute("aria-expanded", "false");
});

test('with manualPagination, "all" prints the page it has', () => {
  const { container } = renderTable({ printMode: "all", manualPagination: true, serverRowCount: 30, defaultPageSize: 3 });
  printMedia.setPrinting(true);
  expect(dataRowNames(container)).toHaveLength(3);
});

test("without matchMedia it follows the browser print events", () => {
  vi.stubGlobal("matchMedia", undefined);
  const { container } = renderTable({ printMode: "all", defaultPageSize: 2 });
  expect(dataRowNames(container)).toHaveLength(2);
  window.dispatchEvent(new Event("beforeprint"));
  expect(dataRowNames(container)).toHaveLength(3);
  window.dispatchEvent(new Event("afterprint"));
  expect(dataRowNames(container)).toHaveLength(2);
});
