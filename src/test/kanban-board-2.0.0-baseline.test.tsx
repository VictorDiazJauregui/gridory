import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { KanbanBoard } from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_VIEW_PROPS, normalizeIconsAndReactIds, type BaselineRow } from "./baseline-fixture";

const KANBAN_GROUPS = [
  {
    id: "status",
    label: "Estado",
    accessor: (row: BaselineRow) => row.status,
    setValue: (row: BaselineRow, value: string) => ({ ...row, status: value as BaselineRow["status"] }),
  },
];

const BOARD_PROPS = {
  ...BASELINE_VIEW_PROPS,
  fields: BASELINE_COLUMNS,
  groups: KANBAN_GROUPS,
  defaultGroupId: "status",
  getCardId: (row: BaselineRow) => row.id,
  collapsibleColumns: true,
  defaultCollapsedColumns: ["Archivada"],
};

// The column size props of 2.1.0 are off by default: without them the board must keep the 2.0.0 markup byte for
// byte, collapsed columns and the loading columns included.
test("the kanban without the 2.1.0 column size props renders the 2.0.0 markup", async () => {
  const { container } = render(<KanbanBoard {...BOARD_PROPS} />);
  await expect(normalizeIconsAndReactIds(container.innerHTML)).toMatchFileSnapshot(
    "./baselines/kanban-board-2.0.0.html",
  );
});

test("the loading kanban without the 2.1.0 column size props renders the 2.0.0 markup", async () => {
  const { container } = render(<KanbanBoard {...BOARD_PROPS} loading />);
  await expect(normalizeIconsAndReactIds(container.innerHTML)).toMatchFileSnapshot(
    "./baselines/kanban-board-loading-2.0.0.html",
  );
});
