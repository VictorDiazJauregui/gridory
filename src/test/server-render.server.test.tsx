import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";
import { CardGrid } from "../components/card-grid";
import { KanbanBoard } from "../components/kanban";
import { MOCK_COMPANY_ROWS } from "../components/mocks/company/company-rows";
import { KANBAN_STATIC_PROPS } from "../components/mocks/kanban/kanban-config";
import { DataTable } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROW_ACTIONS, BASELINE_ROWS } from "./baseline-fixture";

// A server (Next, Remix, renderToString) renders without `window` or `document`: the first render must not read them.
test("the environment has no window, like a server", () => {
  expect(typeof window).toBe("undefined");
  expect(typeof document).toBe("undefined");
});

test("the table renders on the server, with selection, row actions and print mode", () => {
  const html = renderToString(
    <DataTable
      columns={BASELINE_COLUMNS}
      data={BASELINE_ROWS}
      getRowId={(row) => row.id}
      rowActions={BASELINE_ROW_ACTIONS}
      rowSelection={{}}
      printMode="all"
    />,
  );
  expect(html).toContain("gdy-table-grid");
  expect(html).toContain(BASELINE_ROWS[0].name);
});

test("the kanban renders on the server", () => {
  const html = renderToString(
    <KanbanBoard
      fields={KANBAN_STATIC_PROPS.fields}
      groups={KANBAN_STATIC_PROPS.groups}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={MOCK_COMPANY_ROWS.slice(0, 6)}
    />,
  );
  expect(html).toContain(MOCK_COMPANY_ROWS[0].name);
});

test("the card grid renders on the server", () => {
  const html = renderToString(<CardGrid columns={BASELINE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} />);
  expect(html).toContain(BASELINE_ROWS[0].name);
});
