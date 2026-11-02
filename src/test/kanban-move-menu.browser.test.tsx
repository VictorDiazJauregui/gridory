import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { KanbanBoard, type KanbanGroupOption } from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { applyScreen, SCREENS, type ScreenName } from "./browser/environment";
import { measureBox } from "./browser/measure";
import { emulateTouchScreen } from "./browser/touch-screen";

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
  values: ["Activa", "Pendiente", "Archivada"].map((value) => ({ value, label: value })),
};

const PHONES: ScreenName[] = ["iphone14Pro", "pixel7"];

// A long reason makes the submenu wider than the room beside the menu on a phone.
const REASON = "Primero tiene que pasar por Pendiente";

const renderBoard = () =>
  render(
    <KanbanBoard
      fields={BASELINE_COLUMNS}
      groups={[STATUS_GROUP]}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={BASELINE_ROWS}
      canDrop={({ toValue }) => toValue !== "Archivada"}
      getDropDisabledReason={() => REASON}
    />,
  );

const column = (value: string) => document.querySelector(`[data-column-value="${value}"]`) as HTMLElement;

const titlesIn = (value: string) =>
  [...column(value).querySelectorAll(".gdy-kanban-card-title")].map((title) => title.textContent);

const expectInsideScreen = (element: Element, screenName: ScreenName) => {
  const box = measureBox(element);
  expect(box.left).toBeGreaterThanOrEqual(0);
  expect(box.right).toBeLessThanOrEqual(SCREENS[screenName].width);
};

const takesPointerAtCenter = (element: HTMLElement): boolean => {
  const box = element.getBoundingClientRect();
  return element.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
};

// On a busy machine an item can show before it takes the pointer: a click on the page behind it closes the submenu.
const clickMenuItem = async (item: HTMLElement) => {
  await expect.poll(() => takesPointerAtCenter(item)).toBe(true);
  await userEvent.click(item);
};

test.each(PHONES)("on a %s touch screen the menu shows Move to and moves the card", async (screenName) => {
  await applyScreen(screenName);
  await emulateTouchScreen(true);
  renderBoard();
  await userEvent.click(within(column("Activa")).getAllByRole("button", { name: "Opciones" })[0]);
  await clickMenuItem(await screen.findByRole("menuitem", { name: "Mover a…" }));
  const destination = await screen.findByRole("menuitem", { name: "Pendiente" });
  expect(screen.getByRole("menuitem", { name: "Archivada" })).toHaveAccessibleDescription(REASON);
  expectInsideScreen(destination.closest("[role=menu]") as Element, screenName);
  await clickMenuItem(destination);
  expect(titlesIn("Pendiente")).toEqual(["Frío Delta"]);
});

test("on a desktop with a mouse no card shows the ⋯ button without actions", async () => {
  await applyScreen("desktop");
  renderBoard();
  expect(screen.queryAllByRole("button", { name: "Opciones" })).toHaveLength(0);
});
