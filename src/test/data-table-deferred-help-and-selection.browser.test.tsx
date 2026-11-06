import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import type { ColumnDefinition } from "../components/shared/data-model";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { applyScreen, type ScreenName } from "./browser/environment";
import { measureBox } from "./browser/measure";

const gate = vi.hoisted(() => ({ held: Promise.resolve(), release: () => {}, arrivals: 0 }));

// Both pieces wait for the test to release them, so the table can be measured before and after they arrive.
vi.mock("../components/table/header/TableHeaderHelp", async (importOriginal) => {
  await gate.held;
  gate.arrivals += 1;
  return importOriginal();
});
vi.mock("../components/table/selection/SelectCheckbox", async (importOriginal) => {
  await gate.held;
  gate.arrivals += 1;
  return importOriginal();
});

const COLUMNS: ColumnDefinition<BaselineRow>[] = BASELINE_COLUMNS.map((column) => ({ ...column, headerTooltip: `Ayuda de ${column.header}` }));

const measureTable = (container: HTMLElement) => ({
  head: measureBox(container.querySelector("thead tr") as HTMLElement),
  selectColumn: measureBox(container.querySelector('th[data-column-id="_select"]') as HTMLElement),
  help: measureBox(container.querySelector(".gdy-table-head-help") as HTMLElement),
  firstRow: measureBox(container.querySelector("tbody tr") as HTMLElement),
});

const SCREENS: ScreenName[] = ["desktop", "iphone14Pro", "pixel7"];

const measureOnEveryScreen = async (container: HTMLElement) => {
  const boxes = [];
  for (const screen of SCREENS) {
    await applyScreen(screen);
    boxes.push(measureTable(container));
  }
  return boxes;
};

// The downloads happen once per page, so one table is measured on the three screens before and after they arrive.
test("the header and the selection column keep their size when the help and the checkbox arrive", async () => {
  gate.held = new Promise((resolve) => {
    gate.release = () => resolve();
  });
  const { DataTable } = await import("../components/table");
  const { container } = render(<DataTable columns={COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} rowSelection={{}} />);
  const before = await measureOnEveryScreen(container);
  gate.release();
  await vi.waitFor(() => expect(gate.arrivals).toBe(2));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  expect(await measureOnEveryScreen(container)).toEqual(before);
});
