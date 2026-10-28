import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { KanbanBoard, type KanbanBoardProps, type KanbanGroupOption } from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type BoardProps = Partial<KanbanBoardProps<BaselineRow>>;

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
  values: ["Activa", "Pendiente", "Archivada"].map((value) => ({ value, label: value })),
};

const boardElement = (props: BoardProps = {}) => (
  <KanbanBoard
    fields={BASELINE_COLUMNS}
    groups={[STATUS_GROUP]}
    defaultGroupId="status"
    getCardId={(card) => card.id}
    data={BASELINE_ROWS}
    {...props}
  />
);

const renderBoard = (props: BoardProps = {}) => render(boardElement(props));

const column = (value: string) => document.querySelector(`[data-column-value="${value}"]`) as HTMLElement;

const titlesIn = (value: string) =>
  [...column(value).querySelectorAll(".gdy-kanban-card-title")].map((title) => title.textContent);

const toggleOf = (value: string) => within(column(value)).getByRole("button", { name: new RegExp(`(Colapsar|Expandir) ${value}`) });

test("without collapsibleColumns there is no button and nothing collapses", () => {
  renderBoard({ collapsedColumns: ["Activa"] });
  expect(screen.queryByRole("button", { name: /Colapsar|Expandir/ })).toBeNull();
  expect(document.querySelector("[data-collapsed]")).toBeNull();
  expect(titlesIn("Activa")).toEqual(["Frío Delta", "Cold South"]);
});

test("the button collapses the column into a strip with its title and count, and expands it back", () => {
  renderBoard({ collapsibleColumns: true });
  const button = toggleOf("Activa");
  expect(button).toHaveAttribute("aria-expanded", "true");
  expect(button).toHaveAccessibleName("Colapsar Activa");
  fireEvent.click(button);
  expect(column("Activa")).toHaveAttribute("data-collapsed");
  expect(toggleOf("Activa")).toHaveAttribute("aria-expanded", "false");
  expect(toggleOf("Activa")).toHaveAccessibleName("Expandir Activa");
  expect(column("Activa").querySelector(".gdy-kanban-column-body")).toBeNull();
  expect(column("Activa").querySelector(".gdy-kanban-column-title")).toHaveTextContent("Activa");
  expect(column("Activa").querySelector(".gdy-kanban-column-count")).toHaveTextContent("2");
  fireEvent.click(toggleOf("Activa"));
  expect(column("Activa")).not.toHaveAttribute("data-collapsed");
  expect(titlesIn("Activa")).toEqual(["Frío Delta", "Cold South"]);
});

test("uncontrolled: defaultCollapsedColumns starts them collapsed and every change is reported", () => {
  const onCollapsedColumnsChange = vi.fn();
  renderBoard({ collapsibleColumns: true, defaultCollapsedColumns: ["Archivada"], onCollapsedColumnsChange });
  expect(column("Archivada")).toHaveAttribute("data-collapsed");
  fireEvent.click(toggleOf("Activa"));
  expect(onCollapsedColumnsChange).toHaveBeenLastCalledWith(["Archivada", "Activa"]);
  fireEvent.click(toggleOf("Archivada"));
  expect(onCollapsedColumnsChange).toHaveBeenLastCalledWith(["Activa"]);
  expect(column("Archivada")).not.toHaveAttribute("data-collapsed");
});

test("controlled: collapsedColumns decides, the button only asks for the change", () => {
  const onCollapsedColumnsChange = vi.fn();
  const { rerender } = renderBoard({ collapsibleColumns: true, collapsedColumns: [], onCollapsedColumnsChange });
  fireEvent.click(toggleOf("Activa"));
  expect(onCollapsedColumnsChange).toHaveBeenCalledWith(["Activa"]);
  expect(column("Activa")).not.toHaveAttribute("data-collapsed");
  rerender(boardElement({ collapsibleColumns: true, collapsedColumns: ["Activa"], onCollapsedColumnsChange }));
  expect(column("Activa")).toHaveAttribute("data-collapsed");
});

test("a value no column has, as one of another group, changes nothing", () => {
  renderBoard({ collapsibleColumns: true, collapsedColumns: ["Chile"] });
  expect(document.querySelector("[data-collapsed]")).toBeNull();
});

test("a collapsed column still takes a dropped card", () => {
  const onCardMove = vi.fn();
  renderBoard({ collapsibleColumns: true, defaultCollapsedColumns: ["Pendiente"], onCardMove });
  fireEvent.dragStart(screen.getByText("Frío Delta").closest(".gdy-kanban-card") as HTMLElement, { dataTransfer: { setData: vi.fn() } });
  expect(fireEvent.dragOver(column("Pendiente"))).toBe(false);
  fireEvent.drop(column("Pendiente"));
  expect(onCardMove).toHaveBeenCalledWith(expect.objectContaining({ toValue: "Pendiente" }));
  expect(column("Pendiente").querySelector(".gdy-kanban-column-count")).toHaveTextContent("1");
});

test("a collapsed column shows neither the header extra nor the footer", () => {
  const renderColumnHeaderExtra = vi.fn(({ value }: { value: string }) => `extra ${value}`);
  const renderColumnFooter = vi.fn(({ value }: { value: string }) => `pie ${value}`);
  renderBoard({ collapsibleColumns: true, defaultCollapsedColumns: ["Activa"], renderColumnHeaderExtra, renderColumnFooter });
  expect(column("Activa")).not.toHaveTextContent("extra Activa");
  expect(column("Activa").querySelector(".gdy-kanban-column-footer")).toBeNull();
  expect(renderColumnFooter).not.toHaveBeenCalledWith(expect.objectContaining({ value: "Activa" }));
  expect(column("Pendiente").querySelector(".gdy-kanban-column-footer")).toHaveTextContent("pie Pendiente");
});

test("the footer gets the column, its group and its cards, under the cards", () => {
  const renderColumnFooter = vi.fn(() => <button type="button">Cargar más</button>);
  renderBoard({ renderColumnFooter });
  expect(renderColumnFooter).toHaveBeenCalledWith({
    value: "Activa",
    label: "Activa",
    groupId: "status",
    cards: [BASELINE_ROWS[0], BASELINE_ROWS[2]],
    allCards: [BASELINE_ROWS[0], BASELINE_ROWS[2]],
  });
  const footer = column("Activa").querySelector(".gdy-kanban-column-footer") as HTMLElement;
  expect(footer.previousElementSibling).toHaveClass("gdy-kanban-column-body");
  expect(within(footer).getByRole("button", { name: "Cargar más" })).toBeInTheDocument();
});

test("a footer function returning null, undefined or a boolean renders no container", () => {
  const nothing: Record<string, null | boolean | undefined> = { Activa: null, Pendiente: false, Archivada: undefined };
  renderBoard({ renderColumnFooter: ({ value }) => nothing[value] });
  expect(document.querySelector(".gdy-kanban-column-footer")).toBeNull();
});

test("Move to lists a collapsed column as a destination", () => {
  renderBoard({ collapsibleColumns: true, defaultCollapsedColumns: ["Pendiente"], moveMenu: "always" });
  fireEvent.keyDown(within(column("Activa")).getAllByRole("button", { name: "Opciones" })[0], { key: "Enter" });
  fireEvent.keyDown(screen.getByRole("menuitem", { name: "Mover a…" }), { key: "ArrowRight" });
  fireEvent.click(screen.getByRole("menuitem", { name: "Pendiente" }));
  expect(column("Pendiente").querySelector(".gdy-kanban-column-count")).toHaveTextContent("1");
});
