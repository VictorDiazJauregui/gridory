import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { KanbanBoard } from "../components/kanban";
import { DataTable } from "../components/table";
import type { DataViewProps } from "../components/shared/data-view-props";
import { BASELINE_COLUMNS, type BaselineRow } from "./baseline-fixture";

const NO_ROWS: BaselineRow[] = [];
const KANBAN_GROUPS = [{ id: "status", label: "Estado", accessor: (row: BaselineRow) => row.status, setValue: (row: BaselineRow) => row }];

const renderTable = (props: Partial<DataViewProps<BaselineRow>> & { onRowClick?: () => void }) =>
  render(<DataTable columns={BASELINE_COLUMNS} data={NO_ROWS} {...props} />).container;

const renderKanban = (props: Partial<DataViewProps<BaselineRow>>) =>
  render(<KanbanBoard data={NO_ROWS} fields={BASELINE_COLUMNS} groups={KANBAN_GROUPS} defaultGroupId="status" getCardId={(row) => row.id} {...props} />).container;

const RENDERERS = { table: renderTable, kanban: renderKanban };
const emptyOf = (container: HTMLElement) => container.querySelector(".gdy-empty");

test.each(Object.entries(RENDERERS))("the %s keeps the default text and accepts plain text", (_, renderView) => {
  expect(emptyOf(renderView({}))).toHaveTextContent("No se encontraron resultados");
  expect(emptyOf(renderView({ emptyMessage: "Sin empresas" }))?.textContent).toBe("Sin empresas");
});

test.each(Object.entries(RENDERERS))("the %s renders a node with an action", (_, renderView) => {
  const onCreate = vi.fn();
  const container = renderView({
    emptyMessage: (
      <p>
        Todavía no hay empresas. <button type="button" onClick={onCreate}>Crear la primera</button>
      </p>
    ),
  });
  fireEvent.click(screen.getByRole("button", { name: "Crear la primera" }));
  expect(onCreate).toHaveBeenCalledTimes(1);
  expect(emptyOf(container)?.querySelector("p")).toHaveTextContent("Todavía no hay empresas.");
});

test.each(Object.entries(RENDERERS))("in the %s null leaves the empty state without text", (_, renderView) => {
  const empty = emptyOf(renderView({ emptyMessage: null }));
  expect(empty).not.toBeNull();
  expect(empty).toBeEmptyDOMElement();
});

test("a button in the table's empty state never fires onRowClick", () => {
  const onRowClick = vi.fn();
  renderTable({ onRowClick, emptyMessage: <button type="button">Crear</button> });
  fireEvent.click(screen.getByRole("button", { name: "Crear" }));
  expect(onRowClick).not.toHaveBeenCalled();
});
