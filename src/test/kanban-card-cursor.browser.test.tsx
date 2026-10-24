import { render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { KanbanBoard } from "../components/kanban";
import {
  MOCK_COMPANY_ROWS,
  type MockCompanyRow,
} from "../components/mocks/company/company-rows";
import { KANBAN_STATIC_PROPS } from "../components/mocks/kanban/kanban-config";
import { findRequiredElement } from "./browser/elements";
import { readStyle } from "./browser/measure";

const CONSUMER_OVERRIDE = ".gdy-kanban-card { cursor: pointer; }";

const renderBoard = (dragAndDrop: boolean) => {
  const { container } = render(
    <KanbanBoard<MockCompanyRow>
      fields={KANBAN_STATIC_PROPS.fields}
      groups={KANBAN_STATIC_PROPS.groups}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={MOCK_COMPANY_ROWS}
      features={{ dragAndDrop }}
    />,
  );
  return findRequiredElement(container, ".gdy-kanban-card");
};

const addConsumerStylesheet = (css: string) => {
  const style = document.createElement("style");
  style.dataset.testConsumer = "";
  style.textContent = css;
  document.head.append(style);
};

afterEach(() => {
  document.head.querySelectorAll("style[data-test-consumer]").forEach((style) => style.remove());
});

test("a draggable card shows the grab cursor", () => {
  expect(readStyle(renderBoard(true), "cursor")).toBe("grab");
});

test("a card that cannot be dragged keeps the default cursor", () => {
  expect(readStyle(renderBoard(false), "cursor")).toBe("auto");
});

test("a consumer rule on the card class still overrides the grab cursor", () => {
  addConsumerStylesheet(CONSUMER_OVERRIDE);
  expect(readStyle(renderBoard(true), "cursor")).toBe("pointer");
});
