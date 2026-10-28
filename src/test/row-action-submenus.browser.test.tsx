import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { KanbanBoard, type KanbanGroupOption, type RowActionEntry } from "../components/kanban";
import { DataTable } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { applyScreen, type ScreenName } from "./browser/environment";
import { measureBox } from "./browser/measure";

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
};

const CHANGE_STATUS: RowActionEntry<BaselineRow> = {
  id: "change-status",
  label: "Cambiar estado",
  items: ["Activa", "Pendiente", "Archivada"].map((status) => ({ id: status, label: `Mover a ${status}`, onClick: () => {} })),
};

const ROW_ACTIONS = { customActions: [CHANGE_STATUS] };
const SCREENS: ScreenName[] = ["desktop", "iphone14Pro", "pixel7"];

const openSubmenu = async () => {
  await userEvent.click(screen.getAllByRole("button", { name: "Opciones" })[0]);
  await userEvent.click(await screen.findByRole("menuitem", { name: "Cambiar estado" }));
  await screen.findByRole("menuitem", { name: "Mover a Archivada" });
  const [menu, submenu] = screen.getAllByRole("menu");
  return { menu: measureBox(menu), submenu: measureBox(submenu) };
};

const centerOf = (box: ReturnType<typeof measureBox>) => box.left + box.width / 2;

const expectInsideViewport = (box: ReturnType<typeof measureBox>) => {
  expect(box.left).toBeGreaterThanOrEqual(0);
  expect(box.top).toBeGreaterThanOrEqual(0);
  expect(box.right).toBeLessThanOrEqual(window.innerWidth);
  expect(box.bottom).toBeLessThanOrEqual(window.innerHeight);
};

test("next to the left edge the submenu of a card opens to the right of the menu", async () => {
  await applyScreen("desktop");
  render(<KanbanBoard fields={BASELINE_COLUMNS} groups={[STATUS_GROUP]} defaultGroupId="status" getCardId={(card) => card.id} data={BASELINE_ROWS} rowActions={ROW_ACTIONS} />);
  const { menu, submenu } = await openSubmenu();
  expect(centerOf(submenu)).toBeGreaterThan(menu.right);
  expectInsideViewport(submenu);
});

test.each(SCREENS)("on %s the row submenu opens on the side with room and stays on screen", async (screenName) => {
  await applyScreen(screenName);
  render(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} rowActions={ROW_ACTIONS} />);
  const { menu, submenu } = await openSubmenu();
  expectInsideViewport(submenu);
  if (screenName === "desktop") expect(centerOf(submenu)).toBeLessThan(menu.left);
});
