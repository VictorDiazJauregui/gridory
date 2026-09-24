import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { KanbanBoard, type KanbanBoardProps } from "../components/kanban";
import {
  MOCK_COMPANY_ROWS,
  type MockCompanyRow,
} from "../components/mocks/company/company-rows";
import { KANBAN_STATIC_PROPS } from "../components/mocks/kanban/kanban-config";

type BoardProps = Partial<KanbanBoardProps<MockCompanyRow>>;

const { fields, groups } = KANBAN_STATIC_PROPS;

const renderBoard = (props: BoardProps = {}) =>
  render(
    <KanbanBoard
      fields={fields}
      groups={groups}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={MOCK_COMPANY_ROWS}
      {...props}
    />,
  );

const column = (title: string) =>
  screen
    .getByText(title, { selector: ".gdy-kanban-column-title" })
    .closest(".gdy-kanban-column") as HTMLElement;

const cardTitles = (scope: HTMLElement) =>
  [...scope.querySelectorAll(".gdy-kanban-card-title")].map(
    (title) => title.textContent,
  );

const rowsWhere = (predicate: (row: MockCompanyRow) => boolean) =>
  MOCK_COMPANY_ROWS.filter(predicate);

const firstCard = (title: string) =>
  column(title).querySelector(".gdy-kanban-card") as HTMLElement;

const MOVE_TO_PENDING = {
  groupId: "status",
  fromValue: "Activa",
  toValue: "Pendiente",
};

test("renders one column per group value with its cards and count", () => {
  renderBoard();
  ["Activa", "Pendiente", "Archivada"].forEach((status) => {
    const expected = rowsWhere((row) => row.status === status);
    expect(column(status).querySelector(".gdy-kanban-column-count"))
      .toHaveTextContent(String(expected.length));
    expect(cardTitles(column(status))).toEqual(expected.map((row) => row.name));
  });
});

test("reports the clicked card with its group and value", () => {
  const onCardClick = vi.fn();
  renderBoard({ onCardClick });
  const [card] = rowsWhere((row) => row.status === "Pendiente");
  fireEvent.click(firstCard("Pendiente"));
  expect(onCardClick).toHaveBeenCalledWith({
    card,
    cardId: card.id,
    groupId: "status",
    value: "Pendiente",
  });
});

test("moves a card to another column with drag and drop", () => {
  const onCardMove = vi.fn();
  renderBoard({ onCardMove });
  const card = firstCard("Activa");
  const title = card.querySelector(".gdy-kanban-card-title")?.textContent;
  const target = column("Pendiente");
  fireEvent.dragStart(card, { dataTransfer: { setData: vi.fn() } });
  expect(card).toHaveAttribute("data-dragging");
  fireEvent.dragOver(target);
  expect(target).toHaveAttribute("data-drop-target");
  fireEvent.drop(target);
  expect(onCardMove).toHaveBeenCalledWith(
    expect.objectContaining(MOVE_TO_PENDING),
  );
  expect(cardTitles(column("Pendiente"))).toContain(title);
  expect(cardTitles(column("Activa"))).not.toContain(title);
});

test("narrows the cards to the records matching the search", async () => {
  const user = userEvent.setup();
  const { container } = renderBoard();
  await user.type(screen.getByRole("searchbox"), "Frio Delta");
  expect(cardTitles(container)).toEqual(["Frio Delta"]);
});

test("filters the cards from a field trigger", () => {
  const { container } = renderBoard();
  const trigger = screen.getByRole("button", { name: "Marca" });
  fireEvent.click(trigger);
  const panel = container.querySelector(".gdy-panel") as HTMLElement;
  fireEvent.click(within(panel).getByText("Boreal"));
  expect(trigger).toHaveAttribute("data-filtered");
  expect(container.querySelectorAll(".gdy-kanban-card")).toHaveLength(
    rowsWhere((row) => row.brand === "Boreal").length,
  );
});

test("renders every card with the custom renderer", () => {
  renderBoard({
    renderCard: (card) => <em data-testid="custom-card">{card.brand}</em>,
  });
  expect(screen.getAllByTestId("custom-card")).toHaveLength(
    MOCK_COMPANY_ROWS.length,
  );
});

test("applies the style hooks passed as props", () => {
  const { container } = renderBoard({
    boardWrapClassName: "app-board",
    scrollbarColor: "#123456",
  });
  const root = container.querySelector(".gdy-kanban") as HTMLElement;
  expect(root).toHaveClass("gdy-thin-scroll");
  expect(root.style.getPropertyValue("--gdy-scrollbar-thumb")).toBe("#123456");
  expect(container.querySelector(".app-board")).toBeInTheDocument();
});
