import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { KanbanBoard, type KanbanBoardProps, type KanbanGroupOption } from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, BASELINE_VIEW_PROPS, type BaselineRow } from "./baseline-fixture";

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
};

const boardElement = (props: Partial<KanbanBoardProps<BaselineRow>> = {}) => (
  <KanbanBoard
    fields={BASELINE_COLUMNS}
    groups={[STATUS_GROUP]}
    defaultGroupId="status"
    getCardId={(card) => card.id}
    {...BASELINE_VIEW_PROPS}
    {...props}
  />
);

const columnsOf = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>(".gdy-kanban-column")];

const WON_ATTRIBUTES = (value: string) => ({ "data-stage": value.toLowerCase(), "aria-describedby": "legend" });

test("every column carries its raw value, the empty one included", () => {
  const rows = [...BASELINE_ROWS, { id: "b4", name: "Sin estado", country: "Perú", status: "" as BaselineRow["status"] }];
  const columns = columnsOf(render(boardElement({ data: rows })).container);
  expect(columns.map((column) => column.dataset.columnValue)).toEqual(["Activa", "Archivada", ""]);
});

test("getColumnClassName adds its class after the hook and classNames.column", () => {
  const getColumnClassName = (value: string) => (value === "Activa" ? "is-active" : undefined);
  const columns = columnsOf(render(boardElement({ getColumnClassName, classNames: { column: "x-column" } })).container);
  expect(columns.map((column) => column.className)).toEqual(["gdy-kanban-column x-column is-active", "gdy-kanban-column x-column"]);
});

test("getColumnAttributes adds data-* and aria-* attributes per column", () => {
  const [active] = columnsOf(render(boardElement({ getColumnAttributes: WON_ATTRIBUTES })).container);
  expect(active.getAttribute("data-stage")).toBe("activa");
  expect(active.getAttribute("aria-describedby")).toBe("legend");
});

test("getColumnAttributes drops other names, false data hooks and the names the board reserves", () => {
  const getColumnAttributes = () =>
    ({
      id: "hijack",
      "data-off": false,
      "data-column-value": "fake",
      "data-drop-target": true,
      "data-drop-disabled": true,
      "data-collapsed": true,
      "aria-hidden": false,
    }) as never;
  const [active] = columnsOf(render(boardElement({ getColumnAttributes })).container);
  const names = active.getAttributeNames();
  expect(names).toEqual(expect.arrayContaining(["class", "data-column-value", "aria-hidden"]));
  expect(names).not.toEqual(expect.arrayContaining(["id"]));
  ["data-off", "data-drop-target", "data-drop-disabled", "data-collapsed"].forEach((name) => expect(names).not.toContain(name));
  expect(active.dataset.columnValue).toBe("Activa");
  expect(active.getAttribute("aria-hidden")).toBe("false");
});

test("loading columns with a known value keep the value, the class and the attributes", () => {
  const hooks = { getColumnClassName: () => "is-colored", getColumnAttributes: WON_ATTRIBUTES };
  const { container, rerender } = render(boardElement(hooks));
  rerender(boardElement({ ...hooks, loading: true }));
  const columns = columnsOf(container);
  expect(columns.map((column) => column.dataset.columnValue)).toEqual(["Activa", "Archivada"]);
  expect(columns.map((column) => column.dataset.stage)).toEqual(["activa", "archivada"]);
  expect(columns.every((column) => column.classList.contains("is-colored"))).toBe(true);
});

test("placeholder columns before the first data carry nothing of the consumer", () => {
  const container = render(boardElement({ data: [], loading: true, getColumnClassName: () => "is-colored" })).container;
  const columns = columnsOf(container);
  expect(columns).toHaveLength(3);
  expect(columns.map((column) => column.getAttributeNames())).toEqual([["class"], ["class"], ["class"]]);
  expect(columns.every((column) => column.className === "gdy-kanban-column")).toBe(true);
});
