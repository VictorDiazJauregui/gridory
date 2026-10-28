import { render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { DataTable, type ColumnDefinition } from "../components/table";
import { buildCompanyColumns } from "../components/mocks/company/company-columns";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../components/mocks/company/company-rows";
import { TABLE_ROW_ACTIONS } from "../components/mocks/table/table-config";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, type ScreenName } from "./browser/environment";
import { measureBox } from "./browser/measure";

afterEach(() => applyScreen("desktop"));

const PRIORITIES: Record<string, Partial<ColumnDefinition<MockCompanyRow>>> = {
  apps: { hideable: true },
  brand: { priority: 3 },
  createdAt: { priority: 4, width: undefined },
  country: { priority: 5 },
  status: { priority: 7 },
};

const COLUMNS = buildCompanyColumns({ appsWidth: 220, statusSearchable: false }).map((column) => ({
  ...column,
  ...PRIORITIES[column.id],
}));

const renderTable = () =>
  render(
    <DataTable
      columns={COLUMNS}
      data={MOCK_COMPANY_ROWS}
      getRowId={(row) => row.id}
      rowActions={TABLE_ROW_ACTIONS}
      rowSelection={{}}
      responsiveColumns
    />,
  ).container;

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

const shownColumnIds = (container: HTMLElement) =>
  [...container.querySelectorAll("th")].filter((cell) => cell.getClientRects().length > 0).map((cell) => cell.dataset.columnId);

const readOverflow = (container: HTMLElement) => {
  const wrap = findRequiredElement(container, ".gdy-table-wrap");
  return wrap.scrollWidth - wrap.clientWidth;
};

const expectNoHorizontalScroll = async (container: HTMLElement) => {
  await expect.poll(() => readOverflow(container)).toBeLessThanOrEqual(0);
  expect(measureBox(findRequiredElement(container, 'th[data-column-id="_actions"]')).width).toBeGreaterThanOrEqual(56);
};

test.each(["iphone14Pro", "pixel7"] as ScreenName[])("on %s the remaining columns fit without horizontal scroll", async (screen) => {
  await applyScreen(screen);
  const container = renderTable();
  await nextFrame();
  await expectNoHorizontalScroll(container);
  expect(shownColumnIds(container)).toEqual(["_select", "name", "_actions"]);
});

test("on a desktop every column fits and none hides", async () => {
  await applyScreen("desktop");
  const container = renderTable();
  await nextFrame();
  await expectNoHorizontalScroll(container);
  expect(container.querySelector("[data-hidden-by]")).toBeNull();
});

test("a medium width hides the unnumbered hideable column first, then the lowest priority; the title-only column stays", async () => {
  await applyScreen("desktop");
  const container = renderTable();
  const root = findRequiredElement(container, ".gdy-table") as HTMLElement;
  root.style.width = "900px";
  await nextFrame();
  await expectNoHorizontalScroll(container);
  expect(shownColumnIds(container)).toEqual(["_select", "name", "brand", "country", "status", "createdAt", "_actions"]);
  root.style.width = "700px";
  await expect.poll(() => shownColumnIds(container)).not.toContain("brand");
  await expectNoHorizontalScroll(container);
  expect(shownColumnIds(container)).toEqual(["_select", "name", "country", "status", "createdAt", "_actions"]);
  const createdAtTitle = findRequiredElement(container, 'th[data-column-id="createdAt"] .gdy-table-head-label');
  expect(createdAtTitle.scrollWidth).toBeLessThanOrEqual(createdAtTitle.clientWidth);
  root.style.width = "";
  await expect.poll(() => container.querySelector("[data-hidden-by]")).toBeNull();
});

test("growing back on a phone turned sideways shows columns again, without a resize loop warning", async () => {
  const errors = vi.spyOn(console, "error");
  await applyScreen("iphone14Pro");
  const container = renderTable();
  await nextFrame();
  await applyScreen("desktop");
  await expect.poll(() => container.querySelector("[data-hidden-by]")).toBeNull();
  expect(errors).not.toHaveBeenCalledWith(expect.stringContaining("ResizeObserver"));
});
