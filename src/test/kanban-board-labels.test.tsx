import { fireEvent, render, screen, within } from "@testing-library/react";
import { enUS } from "date-fns/locale";
import { expect, test } from "vitest";
import { KanbanBoard, type KanbanBoardProps } from "../components/kanban";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../components/mocks/company/company-rows";
import { KANBAN_STATIC_PROPS } from "../components/mocks/kanban/kanban-config";
import { ENGLISH_KANBAN_LABELS } from "../components/mocks/shared/english-labels";
import { TABLE_ROW_ACTIONS } from "../components/mocks/table/table-config";

type BoardProps = Partial<KanbanBoardProps<MockCompanyRow>>;

const { fields, groups } = KANBAN_STATIC_PROPS;
const STATUS_GROUP = groups.find((group) => group.id === "status");
const WITH_EMPTY_COLUMN = { ...STATUS_GROUP!, values: [...(STATUS_GROUP?.values ?? []), { value: "Nueva", label: "Nueva" }] };
const UNTITLED_ROW: MockCompanyRow = { ...MOCK_COMPANY_ROWS[0], id: "untitled", name: "", status: "" as MockCompanyRow["status"] };

const renderBoard = (props: BoardProps = {}) =>
  render(
    <KanbanBoard
      fields={fields}
      groups={[WITH_EMPTY_COLUMN]}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={[...MOCK_COMPANY_ROWS, UNTITLED_ROW]}
      rowActions={TABLE_ROW_ACTIONS}
      {...props}
    />,
  ).container;

const renderEnglishBoard = (props: BoardProps = {}) =>
  renderBoard({ labels: ENGLISH_KANBAN_LABELS, calendarLocale: enUS, ...props });

const untitledCard = (container: HTMLElement) =>
  [...container.querySelectorAll(".gdy-kanban-card")].find(
    (card) => card.querySelector(".gdy-kanban-card-title")?.textContent === "Untitled",
  ) as HTMLElement;

test("a full English labels object translates the board texts", () => {
  const container = renderEnglishBoard();
  expect(screen.getByPlaceholderText("Search cards...")).toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: "Group by" })).toHaveTextContent("Group by: Estado");
  expect(container.querySelector(".gdy-kanban-empty-col")).toHaveTextContent("No cards");
  expect(container.querySelector(".gdy-kanban-column-title[title='No value']")).toBeInTheDocument();
});

test("a full English labels object translates the default card", () => {
  const card = untitledCard(renderEnglishBoard());
  expect(within(card).getByText("Estado: No value")).toBeInTheDocument();
  expect(within(card).getByText("Alta:")).toBeInTheDocument();
  expect(card).toHaveTextContent("Alta: 03/01/2026");
  expect(within(card).getByRole("button", { name: "Options" })).toBeInTheDocument();
});

test("without labels the default card keeps today's texts", () => {
  const card = [...renderBoard().querySelectorAll(".gdy-kanban-card")].at(-1) as HTMLElement;
  expect(card.querySelector(".gdy-kanban-card-title")).toHaveTextContent("Card");
  expect(within(card).getByText("Estado: Sin valor")).toBeInTheDocument();
  expect(card).toHaveTextContent("Alta: 01/03/2026");
});

test("cardFieldLabel and formatCardDate reshape the default card fields", () => {
  const card = [...renderBoard({
    labels: { cardFieldLabel: (header) => `${header} →`, formatCardDate: (value) => `[${value}]` },
  }).querySelectorAll(".gdy-kanban-card")].at(-1) as HTMLElement;
  expect(within(card).getByText("Alta →")).toBeInTheDocument();
  expect(card).toHaveTextContent("Alta → [2026-03-01]");
});

test("a full English labels object translates the kanban filter menus and the calendar", () => {
  renderEnglishBoard();
  fireEvent.click(screen.getByRole("button", { name: "Alta" }));
  const panel = document.querySelector(".gdy-panel") as HTMLElement;
  fireEvent.click(within(panel).getByText("After (later date)"));
  fireEvent.click(within(panel).getByRole("button", { name: "Pick a date" }));
  const calendar = document.querySelector(".gdy-calendar-root") as HTMLElement;
  const weekdays = [...calendar.querySelectorAll(".gdy-calendar-weekday")].map((day) => day.textContent);
  expect(weekdays).toEqual(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
});

test("the card actions use the labels and the row action labels win over them", () => {
  renderEnglishBoard({ rowActions: { ...TABLE_ROW_ACTIONS, deleteLabel: "Remove" } });
  fireEvent.keyDown(screen.getAllByRole("button", { name: "Options" })[0], { key: "Enter" });
  expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
  expect(screen.getByRole("menuitem", { name: "Remove" })).toBeInTheDocument();
});

test("the older single-text props win over their labels key", () => {
  renderEnglishBoard({ searchPlaceholder: "Find a deal", groupSelectorLabel: "Columns" });
  expect(screen.getByPlaceholderText("Find a deal")).toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: "Columns" })).toHaveTextContent("Columns: Estado");
});
