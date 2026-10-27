import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { DataTable, type DataTableProps } from "../components/table";
import { KanbanBoard, type KanbanBoardProps } from "../components/kanban";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../components/mocks/company/company-rows";
import { KANBAN_STATIC_PROPS } from "../components/mocks/kanban/kanban-config";
import { BASELINE_COLUMNS, BASELINE_ROWS, BASELINE_ROW_ACTIONS, type BaselineRow } from "./baseline-fixture";

const renderTable = (props: Partial<DataTableProps<BaselineRow>> = {}) =>
  render(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />);

const renderBoard = (props: Partial<KanbanBoardProps<MockCompanyRow>> = {}) =>
  render(
    <KanbanBoard
      fields={KANBAN_STATIC_PROPS.fields}
      groups={KANBAN_STATIC_PROPS.groups}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={MOCK_COMPANY_ROWS}
      {...props}
    />,
  );

const all = (container: HTMLElement, selector: string) => [...container.querySelectorAll(selector)];

test("table: five placeholder rows with one cell per visible column, actions included", () => {
  const { container } = renderTable({ loading: true, rowActions: BASELINE_ROW_ACTIONS });
  const rows = all(container, "tbody tr.gdy-table-skeleton-row");
  expect(rows).toHaveLength(5);
  expect(rows[0]).toHaveAttribute("aria-hidden", "true");
  expect(rows[0].querySelectorAll("td.gdy-table-cell.gdy-table-skeleton .gdy-skeleton")).toHaveLength(4);
  expect(all(container, "tr.gdy-table-row")).toHaveLength(0);
});

test("table: loadingRowCount sets the placeholder rows", () => {
  const { container } = renderTable({ loading: true, loadingRowCount: 2 });
  expect(all(container, "tr.gdy-table-skeleton-row")).toHaveLength(2);
});

test("table: the root is busy, the toolbar keeps working and the empty state stays hidden", () => {
  const { container } = renderTable({ loading: true, data: [] });
  const root = container.querySelector(".gdy-table") as HTMLElement;
  expect(root).toHaveAttribute("aria-busy", "true");
  expect(root).toHaveAttribute("data-loading");
  expect(container.querySelector(".gdy-empty")).toBeNull();
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "peru" } });
  expect(screen.getByRole("searchbox")).toHaveValue("peru");
});

test("table: renderLoading replaces the placeholders in one full-width row", () => {
  const { container } = renderTable({ loading: true, renderLoading: () => "Cargando empresas" });
  const cell = container.querySelector("tr.gdy-table-loading-row td") as HTMLElement;
  expect(cell).toHaveTextContent("Cargando empresas");
  expect(cell).toHaveAttribute("colspan", "3");
  expect(all(container, "tr.gdy-table-skeleton-row")).toHaveLength(0);
});

test("table: with rows on screen, the placeholders replace them while loading", () => {
  const { container, rerender } = renderTable();
  expect(all(container, "tr.gdy-table-row")).toHaveLength(3);
  rerender(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} loading />);
  expect(all(container, "tr.gdy-table-row")).toHaveLength(0);
  expect(all(container, "tr.gdy-table-skeleton-row")).toHaveLength(5);
});

test("table: onVisibleRowsChange waits for the data", () => {
  const onVisibleRowsChange = vi.fn();
  const element = (loading: boolean) => (
    <DataTable columns={BASELINE_COLUMNS} data={loading ? [] : BASELINE_ROWS} loading={loading} onVisibleRowsChange={onVisibleRowsChange} />
  );
  const { rerender } = render(element(true));
  expect(onVisibleRowsChange).not.toHaveBeenCalled();
  rerender(element(false));
  expect(onVisibleRowsChange).toHaveBeenCalledTimes(1);
  expect(onVisibleRowsChange.mock.lastCall?.[0].totalRows).toBe(3);
});

test("table: without loading, nothing new is rendered", () => {
  const { container } = renderTable();
  const root = container.querySelector(".gdy-table") as HTMLElement;
  expect(root).not.toHaveAttribute("aria-busy");
  expect(root).not.toHaveAttribute("data-loading");
  expect(container.querySelector(".gdy-skeleton")).toBeNull();
});

const columnTitles = (container: HTMLElement) =>
  all(container, ".gdy-kanban-column-title").map((title) => title.textContent);

test("kanban: the known columns keep their title, without a count, with five placeholder cards each", () => {
  const { container } = renderBoard({ loading: true });
  expect(columnTitles(container)).toEqual(["Activa", "Pendiente", "Archivada"]);
  expect(container.querySelector(".gdy-kanban-column-count")).toBeNull();
  const columns = all(container, ".gdy-kanban-column");
  columns.forEach((column) => expect(column.querySelectorAll(".gdy-kanban-card-skeleton")).toHaveLength(5));
  expect(container.querySelector(".gdy-kanban-card")).toBeNull();
});

test("kanban: loadingRowCount is the placeholder cards per column", () => {
  const { container } = renderBoard({ loading: true, loadingRowCount: 2 });
  expect(all(container, ".gdy-kanban-card-skeleton")).toHaveLength(6);
  expect(all(container, ".gdy-kanban-card-skeleton")[0]).toHaveAttribute("aria-hidden", "true");
});

test("kanban: with no known column yet, three placeholder columns with placeholder titles", () => {
  const { container } = renderBoard({ loading: true, data: [], defaultGroupId: "country" });
  expect(all(container, ".gdy-kanban-column")).toHaveLength(3);
  expect(all(container, ".gdy-kanban-column-title .gdy-skeleton")).toHaveLength(3);
  expect(container.querySelector(".gdy-empty")).toBeNull();
});

test("kanban: the root is busy and renderLoading replaces the columns", () => {
  const { container } = renderBoard({ loading: true, renderLoading: () => "Cargando tablero" });
  const root = container.querySelector(".gdy-kanban") as HTMLElement;
  expect(root).toHaveAttribute("aria-busy", "true");
  expect(root).toHaveAttribute("data-loading");
  expect(container.querySelector(".gdy-kanban-board-wrap")).toHaveTextContent("Cargando tablero");
  expect(container.querySelector(".gdy-kanban-column")).toBeNull();
  expect(screen.getByRole("searchbox")).toBeEnabled();
});

test("kanban: without loading, nothing new is rendered", () => {
  const { container } = renderBoard();
  expect(container.querySelector(".gdy-kanban")).not.toHaveAttribute("aria-busy");
  expect(container.querySelector(".gdy-kanban-card-skeleton")).toBeNull();
});
