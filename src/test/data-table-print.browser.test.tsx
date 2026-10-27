import { render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { DataTable, type DataTableProps } from "../components/table";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../components/mocks/company/company-rows";
import { buildCompanyColumns } from "../components/mocks/company/company-columns";
import { TABLE_ROW_ACTIONS } from "../components/mocks/table/table-config";
import { findRequiredElement } from "./browser/elements";
import { emulateMediaType } from "./browser/print-media";

afterEach(() => emulateMediaType("screen"));

const COLUMNS = buildCompanyColumns({ appsWidth: 200, statusSearchable: false });

const renderTable = (props: Partial<DataTableProps<MockCompanyRow>> = {}) =>
  render(
    <DataTable
      columns={COLUMNS}
      data={MOCK_COMPANY_ROWS}
      getRowId={(row) => row.id}
      rowActions={TABLE_ROW_ACTIONS}
      defaultPageSize={25}
      tableMaxHeightClassName="gdy-table-max-h-sm"
      {...props}
    />,
  ).container;

const isDisplayed = (element: Element) => getComputedStyle(element).display !== "none";

const expectCleanPrint = (container: HTMLElement) => {
  expect(isDisplayed(findRequiredElement(container, ".gdy-toolbar"))).toBe(false);
  expect(isDisplayed(findRequiredElement(container, ".gdy-table-pagination"))).toBe(false);
  expect(isDisplayed(findRequiredElement(container, 'th[data-column-id="_actions"]'))).toBe(false);
  expect(isDisplayed(findRequiredElement(container, 'td[data-column-id="_actions"]'))).toBe(false);
  const wrap = findRequiredElement(container, ".gdy-table-wrap");
  expect(wrap.scrollHeight).toBe(wrap.clientHeight);
  expect(getComputedStyle(findRequiredElement(container, ".gdy-table-head-cell")).position).toBe("static");
  expect(getComputedStyle(findRequiredElement(container, "thead")).display).toBe("table-header-group");
};

test('"page" prints the page without toolbar, pagination, actions or cut rows', async () => {
  const container = renderTable({ printMode: "page" });
  await emulateMediaType("print");
  expectCleanPrint(container);
  expect(container.querySelectorAll("tr.gdy-table-row")).toHaveLength(25);
});

test('"all" prints every filtered row the same way', async () => {
  const container = renderTable({ printMode: "all" });
  await emulateMediaType("print");
  await expect.poll(() => container.querySelectorAll("tr.gdy-table-row").length).toBe(MOCK_COMPANY_ROWS.length);
  expectCleanPrint(container);
});

test('"all" has every row in the document as soon as the browser announces the print', () => {
  const container = renderTable({ printMode: "all" });
  window.dispatchEvent(new Event("beforeprint"));
  expect(container.querySelectorAll("tr.gdy-table-row")).toHaveLength(MOCK_COMPANY_ROWS.length);
  window.dispatchEvent(new Event("afterprint"));
  expect(container.querySelectorAll("tr.gdy-table-row")).toHaveLength(25);
});

test("without printMode the print view keeps the toolbar, the pagination and the scroll", async () => {
  const container = renderTable();
  await emulateMediaType("print");
  expect(isDisplayed(findRequiredElement(container, ".gdy-toolbar"))).toBe(true);
  expect(isDisplayed(findRequiredElement(container, ".gdy-table-pagination"))).toBe(true);
  const wrap = findRequiredElement(container, ".gdy-table-wrap");
  expect(wrap.scrollHeight).toBeGreaterThan(wrap.clientHeight);
});
