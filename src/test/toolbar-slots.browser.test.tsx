import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS } from "./baseline-fixture";
import { findRequiredElement } from "./browser/elements";
import { applyScreen } from "./browser/environment";
import type { ScreenName } from "./browser/environment";
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

test.each(["desktop", "iphone14Pro"] as ScreenName[])(
  "on %s a slot stays on one row, centered, 8px from its neighbors",
  async (screen) => {
    await applyScreen(screen);
    const plain = renderToolbar(false);
    const plainHeight = measureBox(plain.toolbar).height;
    plain.unmount();
    const { toolbar } = renderToolbar(true);
    const [seats, actions] = ["seats", "actions"].map((id) =>
      findRequiredElement(toolbar, `[data-slot-id="${id}"]`),
    );
    expect(measureBox(toolbar).height).toBe(plainHeight);
    expect(Math.abs(centerOf(seats) - centerOf(toolbar))).toBeLessThanOrEqual(1);
    expect(measureBox(actions).left - measureBox(seats).right).toBe(TOOLBAR_GAP);
    expect(readStyle(actions, "display")).toBe("flex");
    const [exportButton, shareButton] = actions.querySelectorAll("button");
    expect(measureBox(shareButton).left - measureBox(exportButton).right).toBe(TOOLBAR_GAP);
  },
);
