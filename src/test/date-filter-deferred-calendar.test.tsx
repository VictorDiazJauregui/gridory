import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { DataTable } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS } from "./baseline-fixture";
import { warmDatePickersBeforeAll } from "./warm-date-pickers";

warmDatePickersBeforeAll();

const download = vi.hoisted(() => ({ failuresLeft: 0 }));

// The real date pickers, behind a download that can be told to fail, as when an old chunk is gone.
vi.mock("../components/shared/date-pickers/deferred-date-pickers", async () => {
  const { createDeferredModule } = await import("../components/shared/deferred/deferred-module");
  const importPickers = async () => {
    if (download.failuresLeft === 0) return import("../components/shared/date-pickers/date-pickers-bundle");
    download.failuresLeft -= 1;
    throw new Error("chunk not found");
  };
  return { deferredDatePickers: createDeferredModule(importPickers) };
});

const SINCE = ["2026-01-15", "2026-03-10", "2025-12-01"];
const DATE_COLUMNS = [
  ...BASELINE_COLUMNS,
  { id: "since", header: "Alta", accessor: (row: { id: string }) => SINCE[Number(row.id.slice(1)) - 1], type: "date" as const, filterable: true },
];

const renderTable = () =>
  render(<DataTable columns={DATE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} />).container;

const openOperator = (container: HTMLElement, operator: string) => {
  fireEvent.click(screen.getByRole("button", { name: "Alta" }));
  const panel = container.querySelector(".gdy-panel") as HTMLElement;
  fireEvent.click(within(panel).getByText(operator));
  return panel;
};

const rowNames = (container: HTMLElement) =>
  [...container.querySelectorAll("tbody tr.gdy-table-row")].map((row) => row.querySelector("td")?.textContent);

beforeEach(() => {
  download.failuresLeft = 0;
});

test("the date input arrives after the operator is picked and the filter applies", async () => {
  const container = renderTable();
  const panel = openOperator(container, "Mayor que (fecha posterior)");
  expect(panel.querySelector(".gdy-panel-section[data-loading][aria-busy='true']")).not.toBeNull();
  await within(panel).findByRole("button", { name: "Seleccionar fecha" });
  expect(panel.querySelector(".gdy-panel-section[data-loading]")).toBeNull();
  fireEvent.change(panel.querySelector("input.gdy-date-input") as HTMLInputElement, { target: { value: "01/02/2026" } });
  fireEvent.click(within(panel).getByText("Aplicar"));
  expect(rowNames(container)).toEqual(["Pack Norte"]);
});
