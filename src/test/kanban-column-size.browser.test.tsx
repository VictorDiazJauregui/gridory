import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { KanbanBoard, type KanbanBoardProps, type KanbanGroupOption } from "../components/kanban";
import { BASELINE_COLUMNS, type BaselineRow } from "./baseline-fixture";
import { applyScreen, SCREENS } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";

const STATUSES = ["Activa", "Pendiente", "Revisión", "Pausada", "Archivada"];

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
  values: STATUSES.map((value) => ({ value, label: value })),
};

// Enough cards in one column to overflow any body: the scroll is what the tests look at.
const MANY_ROWS: BaselineRow[] = Array.from({ length: 30 }, (_, index) => ({
  id: `r${index}`,
  name: `Empresa ${index}`,
  country: "Perú",
  status: "Activa",
}));

interface ParentSize {
  width: number;
  height?: number;
}

const renderBoard = (props: Partial<KanbanBoardProps<BaselineRow>>, parent: ParentSize) =>
  render(
    <div data-testid="parent" style={{ width: parent.width, height: parent.height }}>
      <KanbanBoard
        fields={BASELINE_COLUMNS}
        groups={[STATUS_GROUP]}
        defaultGroupId="status"
        getCardId={(card) => card.id}
        data={MANY_ROWS}
        collapsibleColumns
        defaultCollapsedColumns={["Archivada"]}
        {...props}
      />
    </div>,
  );

const query = (selector: string) => document.querySelector(selector) as HTMLElement;
const queryAll = (selector: string) => [...document.querySelectorAll<HTMLElement>(selector)];
const openColumns = () => queryAll(".gdy-kanban-column:not([data-collapsed])");
const collapsedColumn = () => query(".gdy-kanban-column[data-collapsed]");
const boardViewport = () => query(".gdy-kanban-board-wrap");
const scrollsHorizontally = (element: HTMLElement) => element.scrollWidth > element.clientWidth;

test("without the new props an open column is 320px wide and its body stops at 480px", () => {
  renderBoard({}, { width: 1600 });
  openColumns().forEach((column) => expect(measureBox(column).width).toBe(320));
  expect(measureBox(collapsedColumn()).width).toBe(44);
  const body = query(".gdy-kanban-column-body");
  expect(readStyle(body, "max-height")).toBe("480px");
  expect(measureBox(body).height).toBe(480);
});

test("fillHeight takes the parent's height and every column body scrolls on its own", () => {
  renderBoard({ fillHeight: true }, { width: 1600, height: 600 });
  const parent = measureBox(query('[data-testid="parent"]'));
  expect(measureBox(query(".gdy-kanban")).bottom).toBeCloseTo(parent.bottom, 0);
  const viewport = measureBox(boardViewport());
  expect(viewport.bottom).toBeLessThanOrEqual(parent.bottom);
  openColumns().forEach((column) => expect(measureBox(column).bottom).toBeCloseTo(viewport.bottom - 12, 0));
  const body = query(".gdy-kanban-column-body");
  expect(readStyle(body, "max-height")).toBe("none");
  expect(measureBox(body).bottom).toBeCloseTo(measureBox(openColumns()[0]).bottom - 1, 0);
  expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
  body.scrollTop = 200;
  expect(body.scrollTop).toBe(200);
  expect(boardViewport().scrollHeight).toBeLessThanOrEqual(boardViewport().clientHeight);
});

test("fillHeight keeps the collapsed strip as tall as the columns and the horizontal scroll when they do not fit", () => {
  renderBoard({ fillHeight: true }, { width: 700, height: 600 });
  expect(measureBox(collapsedColumn()).height).toBe(measureBox(openColumns()[0]).height);
  expect(scrollsHorizontally(boardViewport())).toBe(true);
});

test("columnWidth sets the width of every open column, while the collapsed strip keeps its own", () => {
  renderBoard({ columnWidth: 280 }, { width: 1600 });
  openColumns().forEach((column) => expect(measureBox(column).width).toBe(280));
  expect(measureBox(collapsedColumn()).width).toBe(44);
  expect(query(".gdy-kanban").style.getPropertyValue("--gdy-kanban-column-width")).toBe("280px");
});

test("fillWidth shares the board equally among the open columns and leaves no empty strip", () => {
  renderBoard({ fillWidth: true }, { width: 1800 });
  const widths = openColumns().map((column) => measureBox(column).width);
  widths.forEach((width) => expect(width).toBeCloseTo(widths[0], 0));
  expect(widths[0]).toBeGreaterThan(320);
  const lastRight = Math.max(...queryAll(".gdy-kanban-column").map((column) => measureBox(column).right));
  expect(lastRight).toBeCloseTo(measureBox(boardViewport()).right - 12, 0);
  expect(measureBox(collapsedColumn()).width).toBe(44);
  expect(scrollsHorizontally(boardViewport())).toBe(false);
});

test("fillWidth never goes below columnWidth and scrolls horizontally when the columns do not fit", () => {
  renderBoard({ fillWidth: true, columnWidth: 400 }, { width: 1000 });
  openColumns().forEach((column) => expect(measureBox(column).width).toBe(400));
  expect(scrollsHorizontally(boardViewport())).toBe(true);
});

test("the loading columns take the same width and height as the real ones", () => {
  renderBoard({ fillHeight: true, fillWidth: true, loading: true }, { width: 1800, height: 600 });
  const widths = openColumns().map((column) => measureBox(column).width);
  widths.forEach((width) => expect(width).toBeCloseTo(widths[0], 0));
  expect(widths[0]).toBeGreaterThan(320);
  const viewport = measureBox(boardViewport());
  openColumns().forEach((column) => expect(measureBox(column).bottom).toBeCloseTo(viewport.bottom - 12, 0));
});

test("on an iPhone 14 Pro with every prop on, one 320px column fits and the board scrolls sideways, not the page", async () => {
  await applyScreen("iphone14Pro");
  renderBoard({ fillHeight: true, fillWidth: true }, { width: SCREENS.iphone14Pro.width, height: 700 });
  openColumns().forEach((column) => expect(measureBox(column).width).toBe(320));
  expect(scrollsHorizontally(boardViewport())).toBe(true);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(SCREENS.iphone14Pro.width);
  const body = query(".gdy-kanban-column-body");
  expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
});
