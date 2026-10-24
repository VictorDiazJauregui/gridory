import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { KanbanBoard, type KanbanBoardFeatures } from "../components/kanban";
import {
  MOCK_COMPANY_ROWS,
  type MockCompanyRow,
} from "../components/mocks/company/company-rows";
import { KANBAN_STATIC_PROPS } from "../components/mocks/kanban/kanban-config";

const buildBoard = (features: KanbanBoardFeatures) => (
  <KanbanBoard<MockCompanyRow>
    fields={KANBAN_STATIC_PROPS.fields}
    groups={KANBAN_STATIC_PROPS.groups}
    defaultGroupId="status"
    getCardId={(card) => card.id}
    data={MOCK_COMPANY_ROWS}
    features={features}
  />
);

const firstCard = (container: HTMLElement) =>
  container.querySelector(".gdy-kanban-card") as HTMLElement;

test("a card carries data-draggable only while drag and drop is on", () => {
  const { container } = render(buildBoard({ dragAndDrop: true }));
  expect(firstCard(container)).toHaveAttribute("data-draggable");
  expect(firstCard(container)).toHaveAttribute("draggable", "true");
});

test("turning drag and drop off and on updates the same card without remounting it", () => {
  const { container, rerender } = render(buildBoard({ dragAndDrop: false }));
  const card = firstCard(container);
  expect(card).not.toHaveAttribute("data-draggable");
  rerender(buildBoard({ dragAndDrop: true }));
  expect(firstCard(container)).toBe(card);
  expect(card).toHaveAttribute("data-draggable");
});
