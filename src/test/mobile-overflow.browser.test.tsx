import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable } from "../components/table";
import { KanbanBoard, type KanbanGroupOption } from "../components/kanban";
import type { ToolbarCustomSlot } from "../components/shared";
import type { ColumnDefinition } from "../components/shared/data-model";
import { BASELINE_COLUMNS, BASELINE_VIEW_PROPS, type BaselineRow } from "./baseline-fixture";
import { applyScreen, SCREENS, type ScreenName } from "./browser/environment";
import { measureBox } from "./browser/measure";

const PHONES: ScreenName[] = ["iphone14Pro", "pixel7"];
const EDGE_MARGIN = 8;

// A toolbar full of controls, as an app with its own slots has: wider than any phone in one row.
const SLOTS: ToolbarCustomSlot[] = ["Asientos 7/10", "Cargando", "Idioma", "Exportar"].map((label) => ({
  id: label,
  content: <button type="button">{label}</button>,
}));

const TOOLBAR_PROPS = { ...BASELINE_VIEW_PROPS, toolbarSlots: SLOTS, viewSwitch: { active: "table" as const, onChange: () => {} } };

// Enough filterable fields to fill the filter row, so one trigger sits near the right edge of a phone.
const MANY_FIELDS: ColumnDefinition<BaselineRow>[] = ["Empresa", "Marca", "País", "Apps", "Estado", "Etapa"].map(
  (header, index) => ({ id: `field-${index}`, header, accessor: (row) => row.status, filterable: true }),
);

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
};

const renderTable = () =>
  render(<DataTable columns={BASELINE_COLUMNS} getRowId={(row) => row.id} {...TOOLBAR_PROPS} />);

const renderBoard = () =>
  render(
    <KanbanBoard
      fields={MANY_FIELDS}
      groups={[STATUS_GROUP]}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      {...TOOLBAR_PROPS}
    />,
  );

// A page wider than the phone is what breaks it: the menus' scroll lock then leaves the body 0px wide.
const expectNoHorizontalOverflow = (screenName: ScreenName) => {
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(SCREENS[screenName].width);
};

const expectInsideScreen = (element: Element, screenName: ScreenName) => {
  const box = measureBox(element);
  expect(box.left).toBeGreaterThanOrEqual(EDGE_MARGIN);
  expect(box.right).toBeLessThanOrEqual(SCREENS[screenName].width - EDGE_MARGIN);
};

const rightmost = (elements: HTMLElement[]) =>
  elements.reduce((best, element) => (measureBox(element).right > measureBox(best).right ? element : best));

test.each(PHONES)("on a %s the table toolbar wraps instead of widening the page", async (screenName) => {
  await applyScreen(screenName);
  renderTable();
  expectNoHorizontalOverflow(screenName);
});

test.each(PHONES)("on a %s the kanban toolbar wraps instead of widening the page", async (screenName) => {
  await applyScreen(screenName);
  renderBoard();
  expectNoHorizontalOverflow(screenName);
});

test.each(PHONES)("on a %s a kanban filter panel near the right edge opens to the left", async (screenName) => {
  await applyScreen(screenName);
  const { container } = renderBoard();
  const triggers = [...container.querySelectorAll<HTMLElement>(".gdy-kanban-filter-trigger")];
  fireEvent.click(rightmost(triggers));
  const holder = container.querySelector(".gdy-kanban-filter-menu-holder") as HTMLElement;
  expect(holder).toHaveAttribute("data-align", "end");
  expectInsideScreen(holder, screenName);
});

test.each(PHONES)("on a %s the filter panel of the last table column stays inside the screen", async (screenName) => {
  await applyScreen(screenName);
  const { container } = renderTable();
  const wrap = container.querySelector(".gdy-table-wrap") as HTMLElement;
  wrap.scrollLeft = wrap.scrollWidth;
  fireEvent.click(screen.getByRole("button", { name: /Estado/ }));
  expectInsideScreen(container.querySelector(".gdy-table-menu-holder") as HTMLElement, screenName);
});

test("on a desktop the panels open to the right, as before", async () => {
  await applyScreen("desktop");
  const { container } = renderBoard();
  fireEvent.click(container.querySelector(".gdy-kanban-filter-trigger") as HTMLElement);
  expect(container.querySelector(".gdy-kanban-filter-menu-holder")).not.toHaveAttribute("data-align");
});
