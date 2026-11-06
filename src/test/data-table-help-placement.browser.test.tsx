import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS } from "./baseline-fixture";
import { findRequiredElement } from "./browser/elements";
import { measureBox } from "./browser/measure";

const HELP = "Suma de los contratos vigentes, en su moneda";
// The help goes on the last column, away from the left edge, so the tooltip has room to center on it.
const COLUMNS = BASELINE_COLUMNS.map((column, index) => (index === BASELINE_COLUMNS.length - 1 ? { ...column, headerTooltip: HELP } : column));

// `top` moves the whole table, so the header row can sit right at the top edge of the screen.
const openHelpWithTableAt = (top: number) => {
  const { container } = render(
    <div style={{ position: "fixed", top, left: 0, right: 0 }}>
      <DataTable columns={COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} />
    </div>,
  );
  const help = findRequiredElement(container, ".gdy-table-head-help");
  fireEvent.click(help);
  return { help: measureBox(help), tooltip: screen.getByRole("tooltip") };
};

test("the tooltip opens above the ?, centered on it", () => {
  const { help, tooltip } = openHelpWithTableAt(200);
  const box = measureBox(tooltip);
  expect(tooltip).toHaveAttribute("data-side", "top");
  expect(box.bottom).toBeLessThanOrEqual(help.top);
  expect(Math.abs(box.left + box.width / 2 - (help.left + help.width / 2))).toBeLessThanOrEqual(1);
});

test("without room above, the tooltip opens below the ?", () => {
  const { help, tooltip } = openHelpWithTableAt(-40);
  expect(tooltip).toHaveAttribute("data-side", "bottom");
  expect(measureBox(tooltip).top).toBeGreaterThanOrEqual(help.bottom);
});
