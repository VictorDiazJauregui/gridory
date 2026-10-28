import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { KanbanBoard, type KanbanBoardProps, type KanbanGroupOption } from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type BoardProps = Partial<KanbanBoardProps<BaselineRow>>;

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
};

const boardElement = (props: BoardProps) => (
  <KanbanBoard
    fields={BASELINE_COLUMNS}
    groups={[STATUS_GROUP]}
    defaultGroupId="status"
    getCardId={(card) => card.id}
    data={BASELINE_ROWS}
    {...props}
  />
);

const column = (value: string) => document.querySelector(`[data-column-value="${value}"]`) as HTMLElement;

const titlesIn = (value: string) =>
  [...column(value).querySelectorAll(".gdy-kanban-card-title")].map((title) => title.textContent);

const cardNamed = (name: string) => screen.getByText(name).closest(".gdy-kanban-card") as HTMLElement;

const dragTo = (name: string, value: string) => {
  fireEvent.dragStart(cardNamed(name), { dataTransfer: { setData: vi.fn() } });
  fireEvent.dragOver(column(value));
  fireEvent.drop(column(value));
};

const deferred = () => {
  const handlers = {} as { resolve: (value: boolean | void) => void; reject: (error: unknown) => void };
  const promise = new Promise<boolean | void>((resolve, reject) => Object.assign(handlers, { resolve, reject }));
  return { promise, ...handlers };
};

const settle = (action: () => void) => act(async () => action());

const ORIGINAL_ACTIVE = ["Frío Delta", "Cold South"];

afterEach(() => vi.restoreAllMocks());

test("false returned synchronously keeps the card where it was", () => {
  const onCardMove = vi.fn(() => false);
  render(boardElement({ onCardMove }));
  dragTo("Frío Delta", "Archivada");
  expect(onCardMove).toHaveBeenCalledTimes(1);
  expect(titlesIn("Activa")).toEqual(ORIGINAL_ACTIVE);
});

test("a pending move marks the card busy and blocks dragging it again", () => {
  const move = deferred();
  const onCardMove = vi.fn(() => move.promise);
  render(boardElement({ onCardMove }));
  dragTo("Frío Delta", "Archivada");
  const card = cardNamed("Frío Delta");
  expect(titlesIn("Archivada")).toContain("Frío Delta");
  expect(card).toHaveAttribute("data-pending");
  expect(card).toHaveAttribute("aria-busy", "true");
  expect(card).toHaveAttribute("draggable", "false");
  expect(card).not.toHaveAttribute("data-draggable");
  dragTo("Frío Delta", "Activa");
  expect(onCardMove).toHaveBeenCalledTimes(1);
});

test("a promise resolved to false sends the card back to its place", async () => {
  const move = deferred();
  const onCardMoveError = vi.fn();
  render(boardElement({ onCardMove: () => move.promise, onCardMoveError }));
  dragTo("Frío Delta", "Archivada");
  await settle(() => move.resolve(false));
  expect(titlesIn("Activa")).toEqual(ORIGINAL_ACTIVE);
  expect(cardNamed("Frío Delta")).not.toHaveAttribute("data-pending");
  expect(onCardMoveError).not.toHaveBeenCalled();
});

test("a promise resolved to true or nothing keeps the move", async () => {
  const move = deferred();
  render(boardElement({ onCardMove: () => move.promise }));
  dragTo("Frío Delta", "Archivada");
  await settle(() => move.resolve());
  expect(titlesIn("Archivada")).toContain("Frío Delta");
  expect(cardNamed("Frío Delta")).not.toHaveAttribute("aria-busy");
});

test("a rejected promise sends the card back and hands the error to onCardMoveError", async () => {
  const move = deferred();
  const onCardMoveError = vi.fn();
  render(boardElement({ onCardMove: () => move.promise, onCardMoveError }));
  dragTo("Frío Delta", "Archivada");
  const failure = new Error("server rejected");
  await settle(() => move.reject(failure));
  expect(titlesIn("Activa")).toEqual(ORIGINAL_ACTIVE);
  expect(onCardMoveError).toHaveBeenCalledWith(failure, expect.objectContaining({ cardId: "b1", toValue: "Archivada" }));
});

const captureUnhandledRejections = () => {
  const vitestListeners = process.listeners("unhandledRejection");
  const reasons: unknown[] = [];
  process.removeAllListeners("unhandledRejection");
  process.on("unhandledRejection", (reason) => reasons.push(reason));
  const restore = () => {
    process.removeAllListeners("unhandledRejection");
    vitestListeners.forEach((listener) => process.on("unhandledRejection", listener));
  };
  return { reasons, restore };
};

test("without onCardMoveError the rejection is thrown again after the card goes back", async () => {
  const rejections = captureUnhandledRejections();
  const move = deferred();
  render(boardElement({ onCardMove: () => move.promise }));
  dragTo("Frío Delta", "Archivada");
  const failure = new Error("server rejected");
  await settle(() => move.reject(failure));
  await new Promise((resolve) => setTimeout(resolve, 0));
  rejections.restore();
  expect(titlesIn("Activa")).toEqual(ORIGINAL_ACTIVE);
  expect(rejections.reasons).toEqual([failure]);
});

test("new data that arrives while the move is pending wins over the revert", async () => {
  const move = deferred();
  const onCardMove = () => move.promise;
  const { rerender } = render(boardElement({ onCardMove }));
  dragTo("Frío Delta", "Archivada");
  const confirmed = BASELINE_ROWS.map((row) => (row.id === "b1" ? { ...row, status: "Archivada" as const } : row));
  rerender(boardElement({ onCardMove, data: confirmed }));
  await settle(() => move.resolve(false));
  expect(titlesIn("Archivada")).toContain("Frío Delta");
  expect(cardNamed("Frío Delta")).not.toHaveAttribute("data-pending");
});
