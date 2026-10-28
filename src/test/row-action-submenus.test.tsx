import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { KanbanBoard, type KanbanGroupOption, type RowActionEntry } from "../components/kanban";
import { DataTable, type MenuItem } from "../components/table";
import { DuplicateRowActionError, type RowAction } from "../components/shared/menu/row-action";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { expectRenderError } from "./expect-render-error";

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
};

const isActive = (row: BaselineRow) => row.status === "Activa";

const statusAction = (status: BaselineRow["status"], onClick = vi.fn()): RowAction<BaselineRow> => ({
  id: `status-${status}`,
  label: status,
  onClick,
  hidden: (row) => row.status === status,
});

const FAVORITE: RowAction<BaselineRow> = {
  id: "favorite",
  label: (row) => (isActive(row) ? "Quitar favorito" : "Marcar favorito"),
  icon: (row) => <svg data-testid={isActive(row) ? "star-filled" : "star-empty"} />,
  onClick: vi.fn(),
};

const changeStatus = (onClick = vi.fn()): RowActionEntry<BaselineRow> => ({
  id: "change-status",
  label: "Cambiar estado",
  items: [statusAction("Activa", onClick), statusAction("Archivada", onClick)],
});

const boardElement = (customActions: RowActionEntry<BaselineRow>[]) => (
  <KanbanBoard
    fields={BASELINE_COLUMNS}
    groups={[STATUS_GROUP]}
    defaultGroupId="status"
    getCardId={(card) => card.id}
    data={BASELINE_ROWS}
    rowActions={{ customActions }}
  />
);

const openFirstMenu = () => fireEvent.keyDown(screen.getAllByRole("button", { name: "Opciones" })[0], { key: "Enter" });

const menuItemNames = () => screen.getAllByRole("menuitem").map((item) => item.textContent);

test("label and icon follow the row of each menu", () => {
  render(boardElement([FAVORITE]));
  openFirstMenu();
  expect(screen.getByRole("menuitem", { name: "Quitar favorito" })).toBeInTheDocument();
  expect(screen.getByTestId("star-filled")).toBeInTheDocument();
  fireEvent.keyDown(document.activeElement as Element, { key: "Escape" });
  fireEvent.keyDown(screen.getAllByRole("button", { name: "Opciones" })[2], { key: "Enter" });
  expect(screen.getByRole("menuitem", { name: "Marcar favorito" })).toBeInTheDocument();
  expect(screen.getByTestId("star-empty")).toBeInTheDocument();
});

test("the arrow keys open and close a submenu and Escape closes every level", () => {
  const onClick = vi.fn();
  render(boardElement([changeStatus(onClick)]));
  openFirstMenu();
  const trigger = screen.getByRole("menuitem", { name: "Cambiar estado" });
  expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  trigger.focus();
  fireEvent.keyDown(trigger, { key: "ArrowRight" });
  expect(screen.getAllByRole("menu")).toHaveLength(2);
  expect(menuItemNames()).toEqual(["Cambiar estado", "Archivada"]);
  fireEvent.keyDown(screen.getByRole("menuitem", { name: "Archivada" }), { key: "ArrowLeft" });
  expect(screen.getAllByRole("menu")).toHaveLength(1);
  fireEvent.keyDown(trigger, { key: "ArrowRight" });
  fireEvent.keyDown(screen.getByRole("menuitem", { name: "Archivada" }), { key: "Escape" });
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});

test("picking an action of a submenu calls it with the row", () => {
  const onClick = vi.fn();
  render(boardElement([changeStatus(onClick)]));
  openFirstMenu();
  fireEvent.keyDown(screen.getByRole("menuitem", { name: "Cambiar estado" }), { key: "ArrowRight" });
  fireEvent.click(screen.getByRole("menuitem", { name: "Archivada" }));
  expect(onClick).toHaveBeenCalledWith(BASELINE_ROWS[0]);
});

test("a submenu without visible actions is not rendered", () => {
  const onlyActive: RowActionEntry<BaselineRow> = { id: "only-active", label: "Solo", items: () => [statusAction("Activa")] };
  const empty: RowActionEntry<BaselineRow> = { id: "empty", label: "Vacío", items: [] };
  render(boardElement([onlyActive, empty, FAVORITE]));
  openFirstMenu();
  expect(menuItemNames()).toEqual(["Quitar favorito"]);
});

test("an id repeated inside a submenu, or a built-in id there, is rejected", () => {
  const repeated = { ...changeStatus(), items: [statusAction("Activa"), { ...statusAction("Archivada"), id: "status-Activa" }] };
  expectRenderError(boardElement([repeated]), DuplicateRowActionError);
  const builtIn = { ...changeStatus(), items: [{ ...statusAction("Activa"), id: "edit" }] };
  expectRenderError(boardElement([builtIn]), DuplicateRowActionError);
  expectRenderError(boardElement([changeStatus(), { ...FAVORITE, id: "status-Archivada" }]), DuplicateRowActionError);
});

const tableElement = (menuActions: MenuItem<BaselineRow>[]) => (
  <DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} rowActions={{ menuActions }} />
);

test("menuActions of the table take a submenu next to separators and labels", () => {
  const onClick = vi.fn();
  render(tableElement([{ kind: "label", id: "title", label: "Empresa" }, { kind: "separator", id: "sep" }, changeStatus(onClick)]));
  openFirstMenu();
  const menu = screen.getByRole("menu");
  expect(within(menu).getByText("Empresa")).toBeInTheDocument();
  fireEvent.keyDown(within(menu).getByRole("menuitem", { name: "Cambiar estado" }), { key: "ArrowRight" });
  fireEvent.click(screen.getByRole("menuitem", { name: "Archivada" }));
  expect(onClick).toHaveBeenCalledWith(BASELINE_ROWS[0]);
});

test("menuActions rejects an id repeated inside a submenu", () => {
  const repeated = { ...changeStatus(), items: [statusAction("Activa"), { ...statusAction("Archivada"), id: "title" }] };
  expectRenderError(tableElement([{ kind: "label", id: "title", label: "Empresa" }, repeated]), DuplicateRowActionError);
});
