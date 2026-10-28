import type { CSSProperties } from "react";
import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { KanbanBoard, type KanbanBoardProps, type KanbanGroupOption } from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { readContrastRatio } from "./browser/contrast";
import { applyTheme, type Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
  values: [
    { value: "Activa", label: "Activa" },
    { value: "Archivada", label: "Archivada en revisión" },
  ],
};

const THEMES: Theme[] = ["light", "dark"];

// The wrapper is where an app would declare the board's tokens.
const renderBoard = (props: Partial<KanbanBoardProps<BaselineRow>> = {}, tokens: CSSProperties = {}) =>
  render(
    <div style={tokens}>
      <KanbanBoard
        fields={BASELINE_COLUMNS}
        groups={[STATUS_GROUP]}
        defaultGroupId="status"
        getCardId={(card) => card.id}
        data={BASELINE_ROWS}
        collapsibleColumns
        defaultCollapsedColumns={["Archivada"]}
        {...props}
      />
    </div>,
  );

const part = (value: string, selector: string) =>
  document.querySelector(`[data-column-value="${value}"] ${selector}`) as HTMLElement;

const column = (value: string) => document.querySelector(`[data-column-value="${value}"]`) as HTMLElement;

test("a collapsed column is as wide as its token, 44px by default", () => {
  const view = renderBoard();
  expect(measureBox(column("Archivada")).width).toBe(44);
  expect(measureBox(column("Activa")).width).toBe(320);
  view.unmount();
  renderBoard({}, { "--gdy-kanban-column-collapsed-width": "56px" } as CSSProperties);
  expect(measureBox(column("Archivada")).width).toBe(56);
});

test.each(THEMES)("in %s the vertical title fits the strip, whole and readable", (theme) => {
  applyTheme(theme);
  renderBoard();
  const title = part("Archivada", ".gdy-kanban-column-title");
  const strip = measureBox(column("Archivada"));
  const box = measureBox(title);
  expect(readStyle(title, "writing-mode")).toBe("vertical-rl");
  expect(box.height).toBeGreaterThan(box.width);
  expect(box.left).toBeGreaterThanOrEqual(strip.left);
  expect(box.right).toBeLessThanOrEqual(strip.right);
  expect(title.scrollHeight).toBeLessThanOrEqual(title.clientHeight);
  expect(readContrastRatio(title)).toBeGreaterThanOrEqual(4.5);
});

test("the strip runs the height of the row, with the button and the count above the title", () => {
  renderBoard();
  const strip = measureBox(column("Archivada"));
  expect(strip.height).toBe(measureBox(column("Activa")).height);
  const button = measureBox(part("Archivada", ".gdy-kanban-column-toggle"));
  const count = measureBox(part("Archivada", ".gdy-kanban-column-count"));
  const title = measureBox(part("Archivada", ".gdy-kanban-column-title"));
  expect(button.bottom).toBeLessThanOrEqual(count.top);
  expect(count.bottom).toBeLessThanOrEqual(title.top);
});

test("the button does not make the header taller, nor the footer the card list", () => {
  const plain = renderBoard({ collapsibleColumns: false });
  const headHeight = measureBox(part("Activa", ".gdy-kanban-column-head")).height;
  const bodyHeight = measureBox(part("Activa", ".gdy-kanban-column-body")).height;
  plain.unmount();
  renderBoard({ renderColumnFooter: () => "Cargar más" });
  expect(measureBox(part("Activa", ".gdy-kanban-column-head")).height).toBe(headHeight);
  expect(measureBox(part("Activa", ".gdy-kanban-column-body")).height).toBe(bodyHeight);
  const footer = measureBox(part("Activa", ".gdy-kanban-column-footer"));
  expect(footer.top).toBeGreaterThanOrEqual(measureBox(part("Activa", ".gdy-kanban-column-body")).bottom);
});
