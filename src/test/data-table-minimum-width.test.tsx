import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable, type ColumnDefinition, type DataTableProps } from "../components/table";

interface Row {
  id: string;
  name: string;
  country: string;
}

const ROWS: Row[] = [{ id: "1", name: "Frío Delta", country: "Perú" }];
const NAME: ColumnDefinition<Row> = { id: "name", header: "Empresa", accessor: (row) => row.name, width: 200 };
const COUNTRY: ColumnDefinition<Row> = { id: "country", header: "País", accessor: (row) => row.country };

const renderGrid = (props: Partial<DataTableProps<Row>>) => {
  const { container } = render(
    <DataTable columns={[NAME, COUNTRY]} data={ROWS} getRowId={(row) => row.id} {...props} />,
  );
  return container.querySelector<HTMLTableElement>("table.gdy-table-grid");
};

const readMinimumWidth = (grid: HTMLTableElement | null) => grid?.style.getPropertyValue("--gdy-table-min-width");

test("the grid adds the width of each column and 120px for a column without width", () => {
  expect(readMinimumWidth(renderGrid({}))).toBe("320px");
});

test("minWidth replaces the 120px of a column without width", () => {
  const grid = renderGrid({ columns: [NAME, { ...COUNTRY, minWidth: 90 }] });
  expect(readMinimumWidth(grid)).toBe("290px");
});

test("the internal columns add their own widths: selection 44, expansion 40 and actions 56", () => {
  const grid = renderGrid({ rowSelection: {}, renderExpandedRow: () => null, rowActions: { onEdit: () => undefined } });
  expect(readMinimumWidth(grid)).toBe("460px");
});

test("an actions column with a label adds 96px", () => {
  const grid = renderGrid({ rowActions: { onEdit: () => undefined, columnLabel: "Acciones" } });
  expect(readMinimumWidth(grid)).toBe("416px");
});

test("a column hidden with columnVisibility does not count", () => {
  expect(readMinimumWidth(renderGrid({ columnVisibility: { country: false } }))).toBe("200px");
});

test("responsiveColumns keeps its own fit: the grid has no minimum width", () => {
  const grid = renderGrid({ responsiveColumns: true });
  expect(grid?.hasAttribute("style")).toBe(false);
});
