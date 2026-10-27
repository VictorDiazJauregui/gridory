import { render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { DataTable } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, BASELINE_ROW_ACTIONS } from "./baseline-fixture";
import { applyTheme, type Theme } from "./browser/environment";
import { findRequiredElement } from "./browser/elements";
import { measureBox } from "./browser/measure";

afterEach(() => applyTheme("light"));

const tableElement = (loading: boolean, withActions = true) => (
  <DataTable
    columns={BASELINE_COLUMNS}
    data={BASELINE_ROWS}
    getRowId={(row) => row.id}
    rowActions={withActions ? BASELINE_ROW_ACTIONS : undefined}
    loading={loading}
    loadingRowCount={3}
  />
);

const measureFrame = (container: HTMLElement) => ({
  toolbar: measureBox(findRequiredElement(container, ".gdy-toolbar")),
  header: measureBox(findRequiredElement(container, "thead")),
  pagination: measureBox(findRequiredElement(container, ".gdy-table-pagination")),
});

const ROW_CASES: [Theme, boolean][] = [["light", true], ["dark", true], ["light", false]];

test.each(ROW_CASES)("a placeholder row is as tall as a data row (%s, actions %s)", (theme, withActions) => {
  applyTheme(theme);
  const { container, rerender } = render(tableElement(true, withActions));
  const placeholderHeight = measureBox(findRequiredElement(container, "tr.gdy-table-skeleton-row")).height;
  rerender(tableElement(false, withActions));
  expect(placeholderHeight).toBe(measureBox(findRequiredElement(container, "tr.gdy-table-row")).height);
});

test.each<Theme>(["light", "dark"])("the toolbar, header and pagination stay put when loading ends (%s)", (theme) => {
  applyTheme(theme);
  const { container, rerender } = render(tableElement(true));
  const whileLoading = measureFrame(container);
  rerender(tableElement(false));
  expect(measureFrame(container)).toEqual(whileLoading);
});

test("the placeholder bar is visible on the row and follows the token", () => {
  const { container } = render(<div style={{ "--gdy-skeleton-bg": "rgb(1, 2, 3)" } as never}>{tableElement(true)}</div>);
  const bar = findRequiredElement(container, ".gdy-table-skeleton .gdy-skeleton");
  expect(getComputedStyle(bar).backgroundColor).toBe("rgb(1, 2, 3)");
  expect(measureBox(bar).height).toBeGreaterThan(0);
});
