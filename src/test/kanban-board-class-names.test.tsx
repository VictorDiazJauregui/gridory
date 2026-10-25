import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { KanbanBoard, type KanbanBoardClassNames, type KanbanBoardProps, type KanbanGroupOption } from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_VIEW_PROPS, type BaselineRow } from "./baseline-fixture";

const CLASS_NAMES: Required<KanbanBoardClassNames> = {
  root: "x-root",
  toolbar: "x-toolbar",
  filterRow: "x-filter-row",
  board: "x-board",
  column: "x-column",
  columnHead: "x-column-head",
  columnBody: "x-column-body",
  card: "x-card",
  empty: "x-empty",
};

// Each part: its gdy-* hook, the consumer class it takes and how many elements carry it.
const PARTS: [keyof KanbanBoardClassNames, string, number][] = [
  ["root", "gdy-kanban", 1],
  ["toolbar", "gdy-toolbar", 1],
  ["filterRow", "gdy-kanban-filter-row", 1],
  ["board", "gdy-kanban-board-wrap", 1],
  ["column", "gdy-kanban-column", 2],
  ["columnHead", "gdy-kanban-column-head", 2],
  ["columnBody", "gdy-kanban-column-body", 2],
  ["card", "gdy-kanban-card", 3],
];

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
};

const renderBoard = (props: Partial<KanbanBoardProps<BaselineRow>> = {}) =>
  render(
    <KanbanBoard
      fields={BASELINE_COLUMNS}
      groups={[STATUS_GROUP]}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      {...BASELINE_VIEW_PROPS}
      {...props}
    />,
  ).container;

const classesOf = (container: HTMLElement, selector: string) =>
  [...container.querySelectorAll(selector)].map((element) => element.className);

test.each(PARTS)("%s goes after %s on every element of the part", (part, hook, count) => {
  const classes = classesOf(renderBoard({ classNames: CLASS_NAMES }), `.${CLASS_NAMES[part]}`);
  expect(classes).toHaveLength(count);
  classes.forEach((className) => {
    expect(className.startsWith(hook)).toBe(true);
    expect(className.endsWith(CLASS_NAMES[part])).toBe(true);
  });
});

test("className and classNames.root both land on the root, after its flags", () => {
  const container = renderBoard({ className: "x-class", classNames: { root: "x-root" } });
  expect(container.firstElementChild?.className).toBe("gdy-kanban gdy-thin-scroll x-class x-root");
});

test("empty goes on the message of an empty board", () => {
  const container = renderBoard({ data: [], classNames: CLASS_NAMES });
  expect(classesOf(container, ".x-empty")).toEqual(["gdy-empty x-empty"]);
});

test("the empty box of a column does not take empty", () => {
  const values = [{ value: "Activa", label: "Activa" }, { value: "Pendiente", label: "Pendiente" }];
  const container = renderBoard({ groups: [{ ...STATUS_GROUP, values }], classNames: CLASS_NAMES });
  expect(container.querySelector(".gdy-kanban-empty-col")?.className).toBe("gdy-kanban-empty-col");
});

test("the legacy board classes stay and classNames.board goes after them", () => {
  const container = renderBoard({ boardWrapClassName: "x-legacy-board", classNames: { board: "x-board" } });
  expect(classesOf(container, ".gdy-kanban-board-wrap")).toEqual(["gdy-kanban-board-wrap gdy-scroll gdy-kanban-min-h-md x-legacy-board x-board"]);
});

test("a custom card takes the card class too", () => {
  const container = renderBoard({ classNames: { card: "x-card" }, renderCard: (card) => <p>{card.name}</p> });
  expect(classesOf(container, ".gdy-kanban-card")).toEqual(["gdy-kanban-card x-card", "gdy-kanban-card x-card", "gdy-kanban-card x-card"]);
});

test("without classNames every part keeps only its gdy-* classes", () => {
  const container = renderBoard();
  expect(container.querySelector('[class*="x-"]')).toBeNull();
  expect(classesOf(container, ".gdy-kanban-card")[0]).toBe("gdy-kanban-card");
});
