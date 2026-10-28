import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import {
  KanbanBoard,
  type KanbanBoardProps,
  type KanbanDropContext,
  type KanbanGroupOption,
} from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type BoardProps = Partial<KanbanBoardProps<BaselineRow>>;
type Listener = (event: MediaQueryListEvent) => void;

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
  values: ["Activa", "Pendiente", "Archivada"].map((value) => ({ value, label: value })),
};

const noArchiveFromActive = ({ fromValue, toValue }: KanbanDropContext<BaselineRow>) =>
  !(fromValue === "Activa" && toValue === "Archivada");

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

// jsdom has no matchMedia: this stand-in lets a test flip the touch query on and off.
const installMedia = (initial: boolean) => {
  const listeners = new Set<Listener>();
  const media = { matches: initial, queries: [] as string[] };
  vi.stubGlobal("matchMedia", (query: string) => {
    media.queries.push(query);
    return {
      media: query,
      get matches() {
        return media.matches;
      },
      addEventListener: (_type: string, listener: Listener) => listeners.add(listener),
      removeEventListener: (_type: string, listener: Listener) => listeners.delete(listener),
    };
  });
  const setMatches = (matches: boolean) => {
    media.matches = matches;
    act(() => listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent)));
  };
  return { setMatches, queries: media.queries };
};

afterEach(() => {
  vi.unstubAllGlobals();
});

const column = (value: string) => document.querySelector(`[data-column-value="${value}"]`) as HTMLElement;

const titlesIn = (value: string) =>
  [...column(value).querySelectorAll(".gdy-kanban-card-title")].map((title) => title.textContent);

const menuButtonOf = (name: string) =>
  within(screen.getByText(name).closest(".gdy-kanban-card") as HTMLElement).queryByRole("button", { name: "Opciones" });

const openMenuOf = (name: string) => fireEvent.keyDown(menuButtonOf(name) as HTMLElement, { key: "Enter" });

const menuItemNames = () =>
  within(screen.getAllByRole("menu")[0]).getAllByRole("menuitem").map((item) => item.textContent);

const openMoveMenuOf = (name: string) => {
  openMenuOf(name);
  fireEvent.keyDown(screen.getByRole("menuitem", { name: "Mover a…" }), { key: "ArrowRight" });
  return within(screen.getAllByRole("menu")[1]);
};

const moveFromMenu = (name: string, value: string) => fireEvent.click(openMoveMenuOf(name).getByRole("menuitem", { name: value }));

const announcement = () => screen.getByRole("status");

test('"always" puts "Move to" first, with every other column', () => {
  renderBoard({ moveMenu: "always", rowActions: { onEdit: vi.fn() } });
  openMenuOf("Frío Delta");
  expect(menuItemNames()).toEqual(["Mover a…", "Editar"]);
  fireEvent.keyDown(screen.getByRole("menuitem", { name: "Mover a…" }), { key: "ArrowRight" });
  const destinations = within(screen.getAllByRole("menu")[1]).getAllByRole("menuitem").map((item) => item.textContent);
  expect(destinations).toEqual(["Pendiente", "Archivada"]);
});

test('"never" leaves the menu as it was, and no menu at all without actions', () => {
  installMedia(true);
  const { unmount } = renderBoard({ moveMenu: "never", rowActions: { onEdit: vi.fn() } });
  openMenuOf("Frío Delta");
  expect(menuItemNames()).toEqual(["Editar"]);
  unmount();
  renderBoard({ moveMenu: "never" });
  expect(screen.queryAllByRole("button", { name: "Opciones" })).toHaveLength(0);
});

test('"auto" follows the media query and reacts when it changes', () => {
  const media = installMedia(false);
  renderBoard();
  expect(media.queries).toContain("(pointer: coarse)");
  expect(menuButtonOf("Frío Delta")).toBeNull();
  media.setMatches(true);
  expect(menuButtonOf("Frío Delta")).not.toBeNull();
  media.setMatches(false);
  expect(menuButtonOf("Frío Delta")).toBeNull();
});

test("moveMenuMediaQuery replaces the query of auto", () => {
  const media = installMedia(true);
  renderBoard({ moveMenuMediaQuery: "(max-width: 768px)" });
  expect(media.queries).toContain("(max-width: 768px)");
  expect(media.queries).not.toContain("(pointer: coarse)");
});

test("without matchMedia, auto shows nothing and the card looks as before", () => {
  vi.stubGlobal("matchMedia", undefined);
  renderBoard();
  expect(screen.queryByRole("button", { name: "Opciones" })).toBeNull();
  expect(screen.queryByRole("status")).toBeNull();
});

test("moving from the menu calls onCardMove with the event of a drop and announces it", () => {
  const onCardMove = vi.fn();
  renderBoard({ moveMenu: "always", onCardMove });
  moveFromMenu("Frío Delta", "Pendiente");
  expect(onCardMove).toHaveBeenCalledWith({
    card: BASELINE_ROWS[0],
    updatedCard: { ...BASELINE_ROWS[0], status: "Pendiente" },
    cardId: "b1",
    groupId: "status",
    fromValue: "Activa",
    toValue: "Pendiente",
  });
  expect(titlesIn("Pendiente")).toEqual(["Frío Delta"]);
  expect(announcement()).toHaveTextContent("Card movida a Pendiente");
});

test("a column canDrop rejects is disabled, with the reason linked when the app gives one", () => {
  const getDropDisabledReason = vi.fn<(context: KanbanDropContext<BaselineRow>) => string>(() => "Primero tiene que pasar por Pendiente");
  renderBoard({ moveMenu: "always", canDrop: noArchiveFromActive, getDropDisabledReason });
  const archived = openMoveMenuOf("Frío Delta").getByRole("menuitem", { name: "Archivada" });
  expect(archived).toHaveAttribute("aria-disabled", "true");
  expect(archived).toHaveAccessibleDescription("Primero tiene que pasar por Pendiente");
  const askedColumns = getDropDisabledReason.mock.calls.map(([context]) => context.toValue);
  expect(new Set(askedColumns)).toEqual(new Set(["Archivada"]));
  fireEvent.click(archived);
  expect(titlesIn("Activa")).toEqual(["Frío Delta", "Cold South"]);
});

test("without a reason the rejected column is just disabled", () => {
  renderBoard({ moveMenu: "always", canDrop: noArchiveFromActive });
  const archived = openMoveMenuOf("Frío Delta").getByRole("menuitem", { name: "Archivada" });
  expect(archived).toHaveAttribute("data-disabled");
  expect(archived).not.toHaveAttribute("aria-describedby");
});

test("the move is asked again on select, with the same rule as a drop", () => {
  let locked = false;
  const onCardMove = vi.fn();
  renderBoard({ moveMenu: "always", canDrop: () => !locked, onCardMove });
  const pending = openMoveMenuOf("Frío Delta").getByRole("menuitem", { name: "Pendiente" });
  locked = true;
  fireEvent.click(pending);
  expect(onCardMove).not.toHaveBeenCalled();
  expect(titlesIn("Activa")).toEqual(["Frío Delta", "Cold South"]);
});

test("onCardMove returning false keeps the card and announces it went back", () => {
  renderBoard({ moveMenu: "always", onCardMove: () => false });
  moveFromMenu("Frío Delta", "Pendiente");
  expect(titlesIn("Activa")).toEqual(["Frío Delta", "Cold South"]);
  expect(announcement()).toHaveTextContent("La card volvió a Activa");
});

test("a rejected promise sends the card back, reports the error and announces it", async () => {
  const onCardMoveError = vi.fn();
  renderBoard({ moveMenu: "always", onCardMove: () => Promise.reject(new Error("no")), onCardMoveError });
  moveFromMenu("Frío Delta", "Pendiente");
  expect(titlesIn("Pendiente")).toEqual(["Frío Delta"]);
  await waitFor(() => expect(titlesIn("Activa")).toEqual(["Frío Delta", "Cold South"]));
  expect(onCardMoveError).toHaveBeenCalledTimes(1);
  expect(announcement()).toHaveTextContent("La card volvió a Activa");
});

test('"Move to" is disabled while the card waits for onCardMove', () => {
  renderBoard({ moveMenu: "always", onCardMove: () => new Promise(() => {}) });
  moveFromMenu("Frío Delta", "Pendiente");
  openMenuOf("Frío Delta");
  expect(screen.getByRole("menuitem", { name: "Mover a…" })).toHaveAttribute("data-disabled");
});

test("the focus follows the card to its ⋯ button in the new column", async () => {
  renderBoard({ moveMenu: "always" });
  moveFromMenu("Frío Delta", "Pendiente");
  const button = within(column("Pendiente")).getByRole("button", { name: "Opciones" });
  await waitFor(() => expect(button).toHaveFocus());
});

test("when the moved card went out of sight, the focus follows it back on a revert", async () => {
  let reject: (error: Error) => void = () => {};
  renderBoard({ moveMenu: "always", onCardMove: () => new Promise((_resolve, fail) => (reject = fail)), onCardMoveError: vi.fn() });
  moveFromMenu("Frío Delta", "Pendiente");
  (document.activeElement as HTMLElement).blur();
  await act(async () => reject(new Error("no")));
  const button = within(column("Activa")).getAllByRole("button", { name: "Opciones" })[0];
  await waitFor(() => expect(button).toHaveFocus());
});

test("features.rowActions off leaves only Move to; dragAndDrop off removes it", () => {
  const { unmount } = renderBoard({ moveMenu: "always", rowActions: { onEdit: vi.fn() }, features: { rowActions: false } });
  openMenuOf("Frío Delta");
  expect(menuItemNames()).toEqual(["Mover a…"]);
  unmount();
  renderBoard({ moveMenu: "always", rowActions: { onEdit: vi.fn() }, features: { dragAndDrop: false } });
  openMenuOf("Frío Delta");
  expect(menuItemNames()).toEqual(["Editar"]);
});

test("custom cards get the ⋯ button with Move to too", () => {
  renderBoard({ moveMenu: "always", renderCard: (card) => <p>{card.name}</p> });
  openMenuOf("Frío Delta");
  expect(menuItemNames()).toEqual(["Mover a…"]);
});

test('an app action with id "move" still works, and menuActions also get Move to first', () => {
  const ownMove = { id: "move", label: "Mover propio", onClick: vi.fn() };
  renderBoard({ moveMenu: "always", rowActions: { menuActions: [ownMove] } });
  openMenuOf("Frío Delta");
  expect(menuItemNames()).toEqual(["Mover a…", "Mover propio"]);
});

test("labels replace the texts of the menu and of the announcement", () => {
  const labels = { moveTo: "Move to…", cardMovedTo: (value: string) => `Moved to ${value}` };
  renderBoard({ moveMenu: "always", labels });
  openMenuOf("Frío Delta");
  fireEvent.keyDown(screen.getByRole("menuitem", { name: "Move to…" }), { key: "ArrowRight" });
  fireEvent.click(screen.getByRole("menuitem", { name: "Pendiente" }));
  expect(announcement()).toHaveTextContent("Moved to Pendiente");
});
