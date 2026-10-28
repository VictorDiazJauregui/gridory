import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS } from "./baseline-fixture";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, SCREENS } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";

const TOOLBAR_GAP = 8;

const SLOTS = [
  { id: "seats", content: <span>Asientos 7/10</span> },
  {
    id: "actions",
    content: [
      <button key="export" type="button">Exportar</button>,
      <button key="share" type="button">Compartir</button>,
    ],
  },
];

const renderToolbar = (withSlots: boolean) => {
  const { container, unmount } = render(
    <DataTable
      columns={BASELINE_COLUMNS}
      data={BASELINE_ROWS}
      onCreate={() => {}}
      toolbarSlots={withSlots ? SLOTS : undefined}
    />,
  );
  return { toolbar: findRequiredElement(container, ".gdy-toolbar"), unmount };
};

const centerOf = (element: Element) => {
  const box = measureBox(element);
  return box.top + box.height / 2;
};

const findSlots = (toolbar: Element) =>
  ["seats", "actions"].map((id) => findRequiredElement(toolbar, `[data-slot-id="${id}"]`));

// Each slot keeps its content on one row, 8px apart, wherever it lands.
const expectOneRowSlots = (seats: Element, actions: Element) => {
  expect(readStyle(actions, "display")).toBe("flex");
  const [exportButton, shareButton] = actions.querySelectorAll("button");
  expect(measureBox(shareButton).top).toBe(measureBox(exportButton).top);
  expect(measureBox(shareButton).left - measureBox(exportButton).right).toBe(TOOLBAR_GAP);
  expect(measureBox(seats).height).toBeLessThanOrEqual(measureBox(actions).height);
};

test("on desktop a slot stays on one row, centered, 8px from its neighbors, and the toolbar keeps its height", async () => {
  await applyScreen("desktop");
  const plain = renderToolbar(false);
  const plainHeight = measureBox(plain.toolbar).height;
  plain.unmount();
  const { toolbar } = renderToolbar(true);
  const [seats, actions] = findSlots(toolbar);
  expect(measureBox(toolbar).height).toBe(plainHeight);
  expect(Math.abs(centerOf(seats) - centerOf(toolbar))).toBeLessThanOrEqual(1);
  expect(measureBox(actions).left - measureBox(seats).right).toBe(TOOLBAR_GAP);
  expectOneRowSlots(seats, actions);
});

// On a phone the controls do not fit in one row: the toolbar wraps instead of widening the page.
test("on iphone14Pro the slots keep one row each and the toolbar wraps inside the screen", async () => {
  await applyScreen("iphone14Pro");
  const { toolbar } = renderToolbar(true);
  const [seats, actions] = findSlots(toolbar);
  expectOneRowSlots(seats, actions);
  expect(measureBox(toolbar).right).toBeLessThanOrEqual(SCREENS.iphone14Pro.width);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(SCREENS.iphone14Pro.width);
});
