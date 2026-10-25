import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable, type DataTableProps, type RowAttributes } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type TableProps = Partial<DataTableProps<BaselineRow>>;

const renderTable = (props: TableProps = {}) =>
  render(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} {...props} />);

const rows = (container: HTMLElement) => [...container.querySelectorAll(".gdy-table-row")];

const attributeNames = (element: Element) => [...element.attributes].map((attribute) => attribute.name);

test("every row carries data-row-id: the getRowId value, or its position in the page", () => {
  const withIds = renderTable({ getRowId: (row) => row.id });
  expect(rows(withIds.container).map((row) => row.getAttribute("data-row-id"))).toEqual(["b1", "b2", "b3"]);
  withIds.unmount();
  const { container } = renderTable();
  expect(rows(container).map((row) => row.getAttribute("data-row-id"))).toEqual(["0", "1", "2"]);
});

test("without the new props a row only has its class and data-row-id", () => {
  const { container } = renderTable({ getRowId: (row) => row.id });
  expect(attributeNames(rows(container)[0])).toEqual(["class", "data-row-id"]);
  expect(rows(container)[0]).toHaveAttribute("class", "gdy-table-row");
});

test("getRowClassName adds a class after gdy-table-row", () => {
  const { container } = renderTable({
    getRowClassName: (row) => (row.status === "Archivada" ? "is-muted" : undefined),
  });
  const [first, archived] = rows(container);
  expect(first).toHaveAttribute("class", "gdy-table-row");
  expect(archived).toHaveAttribute("class", "gdy-table-row is-muted");
});

test("getRowAttributes renders data-* and aria-* attributes", () => {
  const { container } = renderTable({
    getRowAttributes: (row) => ({
      "data-archived": row.status === "Archivada",
      "data-country": row.country,
      "aria-selected": row.id === "b1",
    }),
  });
  const [first, archived] = rows(container);
  expect(first).not.toHaveAttribute("data-archived");
  expect(archived).toHaveAttribute("data-archived", "true");
  expect(first).toHaveAttribute("data-country", "Perú");
  expect(first).toHaveAttribute("aria-selected", "true");
  expect(archived).toHaveAttribute("aria-selected", "false");
});

test("undefined omits an attribute, on data-* and on aria-*", () => {
  const { container } = renderTable({
    getRowAttributes: () => ({ "data-flag": undefined, "aria-label": undefined }),
  });
  expect(rows(container)[0]).not.toHaveAttribute("data-flag");
  expect(rows(container)[0]).not.toHaveAttribute("aria-label");
});

test("names outside data-* and aria-* and the internal attributes are dropped", () => {
  const forged = { onclick: "alert(1)", class: "forged", "data-row-id": "forged", "data-clickable": "no", "data-ok": 1 };
  const { container } = renderTable({
    getRowId: (row) => row.id,
    onRowClick: () => {},
    getRowAttributes: () => forged as RowAttributes,
  });
  const first = rows(container)[0];
  expect(first).not.toHaveAttribute("onclick");
  expect(first).toHaveAttribute("class", "gdy-table-row");
  expect(first).toHaveAttribute("data-row-id", "b1");
  expect(first).toHaveAttribute("data-clickable", "true");
  expect(first).toHaveAttribute("data-ok", "1");
});
