import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { DataTable } from "../components/table";
import type { DeferredModule } from "../components/shared/deferred/deferred-module";
import { BASELINE_COLUMNS, BASELINE_ROWS } from "./baseline-fixture";
import { applyScreen, type ScreenName } from "./browser/environment";
import { measureBox } from "./browser/measure";

const gate = vi.hoisted(() => ({ release: () => {}, current: undefined as DeferredModule<unknown> | undefined }));

// A fresh download per test, held until the test releases it, so the placeholder can be measured.
vi.mock("../components/shared/date-pickers/deferred-date-pickers", () => ({
  deferredDatePickers: {
    loaded: () => gate.current?.loaded(),
    load: () => gate.current?.load(),
  },
}));

beforeEach(async () => {
  const { createDeferredModule } = await import("../components/shared/deferred/deferred-module");
  const held = new Promise<void>((resolve) => {
    gate.release = resolve;
  });
  gate.current = createDeferredModule(() => held.then(() => import("../components/shared/date-pickers/date-pickers-bundle")));
});

const DATE_COLUMNS = [
  ...BASELINE_COLUMNS,
  { id: "since", header: "Alta", accessor: () => "2026-01-15", type: "date" as const, filterable: true },
];

const CASES: [ScreenName, string, string][] = [
  ["desktop", "Mayor que (fecha posterior)", "Seleccionar fecha"],
  ["desktop", "Entre (rango)", "Seleccionar rango"],
  ["iphone14Pro", "Entre (rango)", "Seleccionar rango"],
  ["pixel7", "Mayor que (fecha posterior)", "Seleccionar fecha"],
];

test.each(CASES)("on %s the date menu keeps its size when the %s inputs arrive", async (screenName, operator, trigger) => {
  await applyScreen(screenName);
  const { container } = render(<DataTable columns={DATE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} />);
  fireEvent.click(screen.getByRole("button", { name: "Alta" }));
  const panel = container.querySelector(".gdy-panel") as HTMLElement;
  fireEvent.click(within(panel).getByText(operator));
  const placeholder = measureBox(panel);
  const placeholderSection = measureBox(panel.querySelector(".gdy-panel-section[data-loading]") as HTMLElement);
  gate.release();
  await within(panel).findByRole("button", { name: trigger });
  expect(measureBox(panel)).toEqual(placeholder);
  expect(measureBox(panel.querySelector(".gdy-date-picker-input")?.closest(".gdy-panel-section") as HTMLElement)).toEqual(
    placeholderSection,
  );
});
