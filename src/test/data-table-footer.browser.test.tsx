import { render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { DataTable, type DataTableProps } from "../components/table";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../components/mocks/company/company-rows";
import { buildCompanyColumns } from "../components/mocks/company/company-columns";
import { TABLE_ROW_ACTIONS } from "../components/mocks/table/table-config";
import { findRequiredElement } from "./browser/elements";
import { applyTheme, type Theme } from "./browser/environment";
import { measureBox } from "./browser/measure";
import { emulateMediaType } from "./browser/print-media";

afterEach(async () => {
  applyTheme("light");
  await emulateMediaType("screen");
});

const COLUMNS = buildCompanyColumns({ appsWidth: 200, statusSearchable: false }).map((column) =>
  column.id === "name" ? { ...column, footer: () => "Total" } : { ...column, footer: () => "—", align: "right" as const },
);

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

const horizontalBox = (element: Element) => {
  const { left, width } = measureBox(element);
  return { left, width };
};

test.each<Theme>(["light", "dark"])("each foot cell sits under its column header (%s)", (theme) => {
  applyTheme(theme);
  const container = renderTable();
  const headers = [...container.querySelectorAll("th.gdy-table-head-cell")];
  const cells = [...container.querySelectorAll("td.gdy-table-foot-cell")];
  expect(cells).toHaveLength(headers.length);
  expect(cells.map(horizontalBox)).toEqual(headers.map(horizontalBox));
});

test.each<Theme>(["light", "dark"])("with stickyHeader the totals stay at the bottom of the rows area (%s)", (theme) => {
  applyTheme(theme);
  const container = renderTable();
  const wrap = findRequiredElement(container, ".gdy-table-wrap");
  const footCell = findRequiredElement(container, "td.gdy-table-foot-cell");
  expect(wrap.scrollHeight).toBeGreaterThan(wrap.clientHeight);
  expect(measureBox(footCell).bottom).toBe(measureBox(wrap).bottom);
  wrap.scrollTop = 200;
  expect(measureBox(footCell).bottom).toBe(measureBox(wrap).bottom);
});

test("without an internal scroll the totals follow the last row", () => {
  const container = renderTable({ tableMaxHeightClassName: undefined });
  const rows = container.querySelectorAll("tr.gdy-table-row");
  const lastRow = rows[rows.length - 1];
  const footCell = findRequiredElement(container, "td.gdy-table-foot-cell");
  expect(measureBox(footCell).top).toBe(measureBox(lastRow).bottom);
  expect(getComputedStyle(footCell).position).toBe("static");
});

test("with printMode the totals print once, after the last row", async () => {
  const container = renderTable({ printMode: "page" });
  await emulateMediaType("print");
  expect(getComputedStyle(findRequiredElement(container, "tfoot")).display).toBe("table-row-group");
  expect(getComputedStyle(findRequiredElement(container, "td.gdy-table-foot-cell")).position).toBe("static");
});
