import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { KanbanBoard } from "../components/kanban";
import { DataTable } from "../components/table";
import {
  BASELINE_COLUMNS,
  BASELINE_VIEW_PROPS,
  normalizeBaselineHtml,
  type BaselineRow,
} from "./baseline-fixture";

const KANBAN_GROUPS = [
  {
    id: "status",
    label: "Estado",
    accessor: (row: BaselineRow) => row.status,
    setValue: (row: BaselineRow, value: string) => ({ ...row, status: value as BaselineRow["status"] }),
  },
];

// 2.0 adds the grid's minimum width (180px + 120px + 120px + the 56px actions column); the rest is the 1.0.1 markup.
const GRID_MINIMUM_WIDTH = ' style="--gdy-table-min-width: 476px;"';

test("the table without the 1.1.0 props renders the 1.0.1 markup plus the 2.0 minimum width", async () => {
  const { container } = render(
    <DataTable
      {...BASELINE_VIEW_PROPS}
      columns={BASELINE_COLUMNS}
      getRowId={(row) => row.id}
      groupableColumnIds={["status"]}
      defaultPageSize={2}
    />,
  );
  const html = normalizeBaselineHtml(container.innerHTML);
  expect(html).toContain(`<table class="gdy-table-grid"${GRID_MINIMUM_WIDTH}>`);
  await expect(html.replace(GRID_MINIMUM_WIDTH, "")).toMatchFileSnapshot("./baselines/data-table-1.0.1.html");
});

test("the kanban without the 1.1.0 props renders the 1.0.1 markup", async () => {
  const { container } = render(
    <KanbanBoard
      {...BASELINE_VIEW_PROPS}
      fields={BASELINE_COLUMNS}
      groups={KANBAN_GROUPS}
      defaultGroupId="status"
      getCardId={(row) => row.id}
    />,
  );
  await expect(normalizeBaselineHtml(container.innerHTML)).toMatchFileSnapshot(
    "./baselines/kanban-board-1.0.1.html",
  );
});
