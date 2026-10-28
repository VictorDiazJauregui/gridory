import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import {
  KanbanBoard,
  type KanbanBoardProps,
  type KanbanDropContext,
  type KanbanGroupOption,
} from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type BoardProps = Partial<KanbanBoardProps<BaselineRow>>;
type DropRule = (context: KanbanDropContext<BaselineRow>) => boolean;

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
  values: ["Activa", "Pendiente", "Archivada"].map((value) => ({ value, label: value })),
};

// An active card cannot be archived directly: it has to go through "Pendiente" first.
const noArchiveFromActive: DropRule = ({ fromValue, toValue }) => !(fromValue === "Activa" && toValue === "Archivada");

const renderBoard = (props: BoardProps = {}) =>
  render(
    <KanbanBoard
      fields={BASELINE_COLUMNS}
      groups={[STATUS_GROUP]}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={BASELINE_ROWS}
      {...props}
    />,
  );

const column = (value: string) => document.querySelector(`[data-column-value="${value}"]`) as HTMLElement;

const cardNamed = (name: string) => screen.getByText(name).closest(".gdy-kanban-card") as HTMLElement;

const titlesIn = (value: string) =>
  [...column(value).querySelectorAll(".gdy-kanban-card-title")].map((title) => title.textContent);

const startDrag = (name: string) => fireEvent.dragStart(cardNamed(name), { dataTransfer: { setData: vi.fn() } });

// fireEvent returns false when a handler called preventDefault.
const dragOverAccepted = (value: string) => !fireEvent.dragOver(column(value));

const dropState = (value: string) => ({
  target: column(value).hasAttribute("data-drop-target"),
  disabled: column(value).hasAttribute("data-drop-disabled"),
});

test("an allowed column accepts the drop and moves the card", () => {
  const onCardMove = vi.fn();
  renderBoard({ canDrop: noArchiveFromActive, onCardMove });
  startDrag("Frío Delta");
  expect(dragOverAccepted("Pendiente")).toBe(true);
  expect(dropState("Pendiente")).toEqual({ target: true, disabled: false });
  fireEvent.drop(column("Pendiente"));
  expect(titlesIn("Pendiente")).toEqual(["Frío Delta"]);
  expect(onCardMove).toHaveBeenCalledTimes(1);
});

test("a rejected column does not accept the drag and is marked disabled, not as target", () => {
  renderBoard({ canDrop: noArchiveFromActive });
  startDrag("Frío Delta");
  expect(dragOverAccepted("Archivada")).toBe(false);
  expect(dropState("Archivada")).toEqual({ target: false, disabled: true });
});

test("the drop is validated again: a forced drop on a rejected column moves nothing", () => {
  const onCardMove = vi.fn();
  renderBoard({ canDrop: noArchiveFromActive, onCardMove });
  startDrag("Frío Delta");
  fireEvent.drop(column("Archivada"));
  expect(titlesIn("Activa")).toEqual(["Frío Delta", "Cold South"]);
  expect(onCardMove).not.toHaveBeenCalled();
  expect(dropState("Archivada")).toEqual({ target: false, disabled: false });
});

test("every rejected column is marked as soon as the drag starts, and unmarked when it ends", () => {
  renderBoard({ canDrop: noArchiveFromActive });
  startDrag("Frío Delta");
  expect(dropState("Archivada").disabled).toBe(true);
  expect(dropState("Pendiente").disabled).toBe(false);
  fireEvent.dragEnd(cardNamed("Frío Delta"));
  expect(document.querySelectorAll("[data-drop-disabled]")).toHaveLength(0);
});

test("canDrop receives the card, its id, the group and both values", () => {
  const canDrop = vi.fn<DropRule>(() => true);
  renderBoard({ canDrop });
  startDrag("Frío Delta");
  expect(canDrop).toHaveBeenCalledWith({
    card: BASELINE_ROWS[0],
    cardId: "b1",
    groupId: "status",
    fromValue: "Activa",
    toValue: "Archivada",
  });
});

test("the card's own column never asks canDrop and stays a no-op target", () => {
  const canDrop = vi.fn<DropRule>(() => false);
  const onCardMove = vi.fn();
  renderBoard({ canDrop, onCardMove });
  startDrag("Frío Delta");
  expect(dragOverAccepted("Activa")).toBe(true);
  expect(dropState("Activa")).toEqual({ target: true, disabled: false });
  expect(canDrop.mock.calls.map(([context]) => context.toValue)).not.toContain("Activa");
  fireEvent.drop(column("Activa"));
  expect(onCardMove).not.toHaveBeenCalled();
});

test("without canDrop every column accepts the drag and none is marked disabled", () => {
  renderBoard();
  startDrag("Frío Delta");
  expect(["Activa", "Pendiente", "Archivada"].map(dragOverAccepted)).toEqual([true, true, true]);
  expect(document.querySelectorAll("[data-drop-disabled]")).toHaveLength(0);
});

test("leaving a column clears its target mark but keeps the rejected ones until the drag ends", () => {
  renderBoard({ canDrop: noArchiveFromActive });
  startDrag("Frío Delta");
  dragOverAccepted("Pendiente");
  fireEvent.dragLeave(column("Pendiente"));
  expect(dropState("Pendiente")).toEqual({ target: false, disabled: false });
  expect(dropState("Archivada").disabled).toBe(true);
});
