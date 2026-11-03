import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { KanbanBoard, type KanbanGroupOption } from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
};

const RENAMED_ROWS = BASELINE_ROWS.map((row) => ({ ...row, name: `${row.name} (nuevo)` }));

const boardPainting = (paintedNames: string[]) => (data: BaselineRow[]) => (
  <KanbanBoard
    fields={BASELINE_COLUMNS}
    groups={[STATUS_GROUP]}
    defaultGroupId="status"
    getCardId={(card) => card.id}
    data={data}
    renderCard={(card) => {
      paintedNames.push(card.name);
      return <span>{card.name}</span>;
    }}
  />
);

test("new data reaches the cards in the same render, without a pass over the old cards", () => {
  const paintedNames: string[] = [];
  const boardElement = boardPainting(paintedNames);
  const { rerender } = render(boardElement(BASELINE_ROWS));
  paintedNames.length = 0;
  rerender(boardElement(RENAMED_ROWS));
  expect(paintedNames.length).toBeGreaterThan(0);
  expect(paintedNames.filter((name) => !name.endsWith("(nuevo)"))).toEqual([]);
});
