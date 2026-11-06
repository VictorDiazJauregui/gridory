import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import "../components/kanban/styles.css";
import "../components/table/styles.css";
import { CardGrid, type CardGridProps } from "../components/card-grid";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { readContrastRatio } from "./browser/contrast";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, applyTheme, SCREENS, type ScreenName, type Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";

// The default card is the kanban card and the pagination the table's: a page with the card grid loads
// kanban.css and table.css next to card-grid.css, as docs/card-grid.md says.
const PHONES: ScreenName[] = ["iphone14Pro", "pixel7"];

const ROWS: BaselineRow[] = Array.from({ length: 12 }, (_, index) => ({
  ...BASELINE_ROWS[index % BASELINE_ROWS.length],
  id: `r${index}`,
  name: `${BASELINE_ROWS[index % BASELINE_ROWS.length].name} con un nombre largo número ${index + 1}`,
}));

const renderGrid = (props: Partial<CardGridProps<BaselineRow>> = {}) =>
  render(<CardGrid columns={BASELINE_COLUMNS} data={ROWS} getRowId={(row) => row.id} {...props} />).container;

const listCards = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>(".gdy-card-grid-card")];

const countColumns = (cards: HTMLElement[]) => new Set(cards.map((card) => measureBox(card).left)).size;

test("on a desktop the cards fill as many columns of at least the minimum width as fit", () => {
  const container = renderGrid();
  const list = findRequiredElement(container, ".gdy-card-grid-list");
  const cards = listCards(container);
  const contentWidth = measureBox(list).width - 2 * parseFloat(readStyle(list, "padding-left"));
  expect(countColumns(cards)).toBe(Math.floor((contentWidth + 12) / (260 + 12)));
  cards.forEach((card) => expect(measureBox(card).width).toBeGreaterThanOrEqual(260));
});

test("--gdy-card-grid-min changes the minimum width of a column", () => {
  const container = renderGrid();
  const root = findRequiredElement(container, ".gdy-card-grid") as HTMLElement;
  const before = countColumns(listCards(container));
  root.style.setProperty("--gdy-card-grid-min", "520px");
  expect(countColumns(listCards(container))).toBeLessThan(before);
  listCards(container).forEach((card) => expect(measureBox(card).width).toBeGreaterThanOrEqual(520));
});

test.each(PHONES)("on a %s the cards stack in one column without horizontal overflow", async (screenName) => {
  await applyScreen(screenName);
  const container = renderGrid();
  const list = measureBox(findRequiredElement(container, ".gdy-card-grid-list"));
  const cards = listCards(container);
  expect(countColumns(cards)).toBe(1);
  cards.forEach((card) => expect(measureBox(card).right).toBeLessThanOrEqual(list.right));
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(SCREENS[screenName].width);
});

test.each(["light", "dark"] as Theme[])("in %s a card reached with Tab shows the ring and its text reads well", async (theme) => {
  applyTheme(theme);
  const container = renderGrid({ onRowClick: () => {}, features: { search: false, filtering: false, createButton: false } });
  (document.activeElement as HTMLElement | null)?.blur();
  await userEvent.tab();
  const card = listCards(container)[0];
  expect(document.activeElement).toBe(card);
  expect(card.matches(":focus-visible")).toBe(true);
  expect(readStyle(card, "outline-style")).toBe("solid");
  expect(readStyle(card, "outline-width")).toBe("2px");
  expect(readContrastRatio(findRequiredElement(card, ".gdy-kanban-card-title"))).toBeGreaterThanOrEqual(4.5);
  expect(readContrastRatio(findRequiredElement(card, ".gdy-kanban-card-value"))).toBeGreaterThanOrEqual(4.5);
});

test("the ring reads --gdy-card-grid-focus-ring, falling back to the base ring", async () => {
  const container = renderGrid({ onRowClick: () => {}, features: { search: false, filtering: false, createButton: false } });
  (document.activeElement as HTMLElement | null)?.blur();
  await userEvent.tab();
  const card = listCards(container)[0];
  const baseRing = readStyle(card, "outline-color");
  card.style.setProperty("--gdy-card-grid-focus-ring", "rgb(255, 0, 0)");
  expect(readStyle(card, "outline-color")).toBe("rgb(255, 0, 0)");
  expect(baseRing).not.toBe("rgb(255, 0, 0)");
});

test("in dark theme the card takes the dark card background", () => {
  const light = readStyle(listCards(renderGrid())[0], "background-color");
  applyTheme("dark");
  expect(readStyle(listCards(renderGrid())[0], "background-color")).not.toBe(light);
});
