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

test("the table without the 1.1.0 props renders the 1.0.1 markup", async () => {
  const { container } = render(
    <DataTable
      {...BASELINE_VIEW_PROPS}
      columns={BASELINE_COLUMNS}
      getRowId={(row) => row.id}
      groupableColumnIds={["status"]}
      defaultPageSize={2}
    />,
  );
  await expect(normalizeBaselineHtml(container.innerHTML)).toMatchFileSnapshot(
    "./baselines/data-table-1.0.1.html",
  );
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
