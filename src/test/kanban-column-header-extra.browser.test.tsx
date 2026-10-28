import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { KanbanBoard, type KanbanBoardProps, type KanbanGroupOption } from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { applyScreen, type ScreenName } from "./browser/environment";
import { measureBox } from "./browser/measure";

const LONG_TITLE = "Negociación avanzada con el área de compras del cliente";

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
  values: [
    { value: "Activa", label: "Activa" },
    { value: "Archivada", label: LONG_TITLE },
  ],
};

const SCREENS: ScreenName[] = ["desktop", "iphone14Pro", "pixel7"];

const renderBoard = (props: Partial<KanbanBoardProps<BaselineRow>> = {}) =>
  render(
    <KanbanBoard
      fields={BASELINE_COLUMNS}
      groups={[STATUS_GROUP]}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={BASELINE_ROWS}
      {...props}
    />,
  );

const headPart = (value: string, part: string) =>
  document.querySelector(`[data-column-value="${value}"] .gdy-kanban-column-${part}`) as HTMLElement;

const measureHeadHeight = (props: Partial<KanbanBoardProps<BaselineRow>> = {}) => {
  const view = renderBoard(props);
  const height = measureBox(headPart("Activa", "head")).height;
  view.unmount();
  return height;
};

test.each(SCREENS)("on %s one line of content does not make the header taller", async (screenName) => {
  await applyScreen(screenName);
  const plain = measureHeadHeight();
  const withExtra = measureHeadHeight({ renderColumnHeaderExtra: () => "S/ 1.250 · S/ 3.400" });
  expect(withExtra).toBe(plain);
});

test("the content sits next to the count and a long title gives way with its ellipsis", async () => {
  await applyScreen("desktop");
  renderBoard({ renderColumnHeaderExtra: () => "S/ 1.250 · S/ 3.400" });
  const title = headPart("Archivada", "title");
  const extra = measureBox(headPart("Archivada", "extra"));
  const count = measureBox(headPart("Archivada", "count"));
  expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
  expect(measureBox(title).right).toBeLessThanOrEqual(extra.left);
  expect(count.left - extra.right).toBe(8);
  expect(headPart("Archivada", "extra").scrollWidth).toBeLessThanOrEqual(extra.width);
});
