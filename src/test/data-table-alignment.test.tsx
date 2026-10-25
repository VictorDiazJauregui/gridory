import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { KanbanBoard } from "../components/kanban";
import { DataTable, type ColumnDefinition, type RowActions } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, BASELINE_ROW_ACTIONS, type BaselineRow } from "./baseline-fixture";

const AMOUNT_COLUMN: ColumnDefinition<BaselineRow> = {
  id: "amount",
  header: "Monto",
  accessor: (row) => row.name.length * 100,
  sortable: true,
  align: "right",
};

const renderTable = (columns: ColumnDefinition<BaselineRow>[], rowActions: RowActions<BaselineRow> = BASELINE_ROW_ACTIONS) =>
  render(<DataTable columns={columns} data={BASELINE_ROWS} getRowId={(row) => row.id} rowActions={rowActions} />);

const alignOf = (container: HTMLElement, selector: string) =>
  [...container.querySelectorAll(selector)].map((element) => element.getAttribute("data-align"));

test("align marks the header, its trigger and every cell of the column", () => {
  const { container } = renderTable([...BASELINE_COLUMNS, AMOUNT_COLUMN]);
  expect(alignOf(container, 'th[data-column-id="amount"]')).toEqual(["right"]);
  expect(alignOf(container, 'th[data-column-id="amount"] .gdy-table-head-trigger')).toEqual(["right"]);
  expect(alignOf(container, 'td[data-column-id="amount"]')).toEqual(["right", "right", "right"]);
});

test("without align or headerAlign no cell carries the attribute", () => {
  const { container } = renderTable(BASELINE_COLUMNS);
  expect(container.querySelector("[data-align]")).toBeNull();
});

test("headerAlign moves only the header and defaults to align", () => {
  const columns = [{ ...AMOUNT_COLUMN, headerAlign: "left" as const }, { ...BASELINE_COLUMNS[0], headerAlign: "center" as const }];
  const { container } = renderTable(columns);
  expect(alignOf(container, 'th[data-column-id="amount"], th[data-column-id="amount"] button')).toEqual(["left", "left"]);
  expect(alignOf(container, 'td[data-column-id="amount"]')).toEqual(["right", "right", "right"]);
  expect(alignOf(container, 'th[data-column-id="name"]')).toEqual(["center"]);
  expect(alignOf(container, 'td[data-column-id="name"]')).toEqual([null, null, null]);
});

test("the attribute follows the column when the columns are reordered", () => {
  const { container, rerender } = renderTable([AMOUNT_COLUMN, ...BASELINE_COLUMNS]);
  rerender(<DataTable columns={[...BASELINE_COLUMNS, AMOUNT_COLUMN]} data={BASELINE_ROWS} getRowId={(row) => row.id} />);
  const firstRow = container.querySelector(".gdy-table-row");
  expect(firstRow?.lastElementChild).toHaveAttribute("data-align", "right");
  expect(firstRow?.firstElementChild).not.toHaveAttribute("data-align");
});

test("the actions column keeps its empty header and right alignment by default", () => {
  const { container } = renderTable(BASELINE_COLUMNS);
  const header = container.querySelector('th[data-column-id="_actions"]');
  expect(header).toBeEmptyDOMElement();
  expect(container.querySelector(".gdy-table-actions-cell")).not.toHaveAttribute("data-align");
  expect(screen.getAllByRole("button", { name: "Opciones" })[0]).toHaveAttribute("title", "Opciones");
});

test("columnLabel titles the actions column, aligned right unless align says otherwise", () => {
  const { container } = renderTable(BASELINE_COLUMNS, { ...BASELINE_ROW_ACTIONS, columnLabel: "Acciones" });
  const header = container.querySelector('th[data-column-id="_actions"]');
  expect(header).toHaveTextContent("Acciones");
  expect(header?.querySelector(".gdy-table-actions-head-label")).not.toBeNull();
  expect(alignOf(container, '[data-column-id="_actions"], .gdy-table-actions-cell')).toEqual(Array(7).fill("right"));
});

test("rowActions.align centers the actions header, cells and button", () => {
  const { container } = renderTable(BASELINE_COLUMNS, { ...BASELINE_ROW_ACTIONS, align: "center" });
  expect(alignOf(container, '[data-column-id="_actions"], .gdy-table-actions-cell')).toEqual(Array(7).fill("center"));
});

test("triggerLabel names the ⋯ button for screen readers and as its tooltip", () => {
  renderTable(BASELINE_COLUMNS, { ...BASELINE_ROW_ACTIONS, triggerLabel: "Acciones de la empresa" });
  const [button] = screen.getAllByRole("button", { name: "Acciones de la empresa" });
  expect(button).toHaveAttribute("title", "Acciones de la empresa");
});

test("the kanban card ⋯ button takes the same triggerLabel", () => {
  render(
    <KanbanBoard
      data={BASELINE_ROWS}
      fields={BASELINE_COLUMNS}
      groups={[{ id: "status", label: "Estado", accessor: (row) => row.status, setValue: (row) => row }]}
      defaultGroupId="status"
      getCardId={(row) => row.id}
      rowActions={{ ...BASELINE_ROW_ACTIONS, triggerLabel: "Acciones de la card" }}
    />,
  );
  expect(screen.getAllByRole("button", { name: "Acciones de la card" })).toHaveLength(BASELINE_ROWS.length);
});
