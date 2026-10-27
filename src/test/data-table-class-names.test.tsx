import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable, type DataTableClassNames, type DataTableProps } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_VIEW_PROPS, type BaselineRow } from "./baseline-fixture";

const CLASS_NAMES: Required<DataTableClassNames> = {
  root: "x-root",
  toolbar: "x-toolbar",
  wrap: "x-wrap",
  table: "x-table",
  headRow: "x-head-row",
  headCell: "x-head-cell",
  row: "x-row",
  cell: "x-cell",
  pagination: "x-pagination",
  empty: "x-empty",
  foot: "x-foot",
  footCell: "x-foot-cell",
};

// Each part: its gdy-* hook, the consumer class it takes and how many elements carry it.
const PARTS: [keyof DataTableClassNames, string, number][] = [
  ["root", "gdy-table", 1],
  ["toolbar", "gdy-toolbar", 1],
  ["wrap", "gdy-table-wrap", 1],
  ["table", "gdy-table-grid", 1],
  ["headRow", "gdy-table-head-row", 1],
  ["headCell", "gdy-table-head-cell", 4],
  ["row", "gdy-table-row", 3],
  ["cell", "gdy-table-cell", 12],
  ["pagination", "gdy-table-pagination", 1],
];

const renderTable = (props: Partial<DataTableProps<BaselineRow>> = {}) =>
  render(
    <DataTable columns={BASELINE_COLUMNS} getRowId={(row) => row.id} {...BASELINE_VIEW_PROPS} {...props} />,
  ).container;

const classesOf = (container: HTMLElement, selector: string) =>
  [...container.querySelectorAll(selector)].map((element) => element.className);

test.each(PARTS)("%s goes after %s on every element of the part", (part, hook, count) => {
  const classes = classesOf(renderTable({ classNames: CLASS_NAMES }), `.${CLASS_NAMES[part]}`);
  expect(classes).toHaveLength(count);
  classes.forEach((className) => {
    expect(className.startsWith(hook)).toBe(true);
    expect(className.endsWith(CLASS_NAMES[part])).toBe(true);
  });
});

test("className and classNames.root both land on the root, after its flags", () => {
  const container = renderTable({ className: "x-class", classNames: { root: "x-root" }, fillHeight: true });
  expect(container.firstElementChild?.className).toBe("gdy-table gdy-table-fill gdy-table-sticky gdy-thin-scroll x-class x-root");
});

test("the empty state takes empty and not cell", () => {
  const container = renderTable({ data: [], classNames: CLASS_NAMES });
  const emptyCell = container.querySelector(".gdy-empty");
  expect(emptyCell?.className).toBe("gdy-table-cell gdy-empty x-empty");
  expect(container.querySelector(".x-cell")).toBeNull();
});

test("the legacy wrap classes stay and classNames.wrap goes after them", () => {
  const container = renderTable({
    tableMaxHeightClassName: "x-max",
    tableWrapClassName: "x-legacy-wrap",
    classNames: { wrap: "x-wrap" },
  });
  expect(classesOf(container, ".gdy-table-wrap")).toEqual(["gdy-table-wrap gdy-scroll gdy-table-min-h-md x-max x-legacy-wrap x-wrap"]);
});

test("getRowClassName goes after classNames.row", () => {
  const container = renderTable({ classNames: { row: "x-row" }, getRowClassName: (row) => `x-${row.id}` });
  expect(classesOf(container, ".gdy-table-row")).toEqual(["gdy-table-row x-row x-b1", "gdy-table-row x-row x-b2", "gdy-table-row x-row x-b3"]);
});

test("group rows keep their own hooks and take neither row nor cell", () => {
  const container = renderTable({ classNames: CLASS_NAMES, groupableColumnIds: ["status"], defaultGroupBy: "status" });
  expect(container.querySelectorAll(".gdy-table-group-row").length).toBeGreaterThan(0);
  expect(container.querySelector(".gdy-table-group-row.x-row, .gdy-table-group-cell.x-cell")).toBeNull();
});

test("without classNames every part keeps only its gdy-* classes", () => {
  const container = renderTable();
  expect(container.querySelector('[class*="x-"]')).toBeNull();
  expect(classesOf(container, ".gdy-table-row")[0]).toBe("gdy-table-row");
});
