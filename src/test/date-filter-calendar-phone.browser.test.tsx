import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS } from "./baseline-fixture";
import { applyScreen, SCREENS, type ScreenName } from "./browser/environment";
import { measureBox } from "./browser/measure";

// Two columns fit a phone, so the date header, and the panel under it, start on screen.
const DATE_COLUMNS = [
  BASELINE_COLUMNS[0],
  { id: "since", header: "Alta", accessor: () => "2026-01-15", type: "date" as const, filterable: true },
];

const openRangeCalendar = async () => {
  render(<DataTable columns={DATE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} />);
  fireEvent.click(screen.getByRole("button", { name: "Alta" }));
  const panel = document.querySelector(".gdy-panel") as HTMLElement;
  fireEvent.click(within(panel).getByText("Entre (rango)"));
  fireEvent.click(await within(panel).findByRole("button", { name: "Seleccionar rango" }));
  return (await screen.findByRole("button", { name: "Mes siguiente" })).closest(".gdy-calendar-popover") as HTMLElement;
};

// 212 × 552 is the 1.5.0 calendar on a phone: the two months stack, each seven days wide.
test.each<ScreenName>(["pixel7", "iphone14Pro"])("on %s the open range calendar stacks its months within the screen width", async (screenName) => {
  await applyScreen(screenName);
  const popover = await openRangeCalendar();
  const box = measureBox(popover);
  expect(box.left).toBeGreaterThanOrEqual(0);
  expect(box.right).toBeLessThanOrEqual(SCREENS[screenName].width);
  expect({ width: box.width, height: box.height }).toEqual({ width: 212, height: 552 });
  const [first, second] = [...popover.querySelectorAll(".gdy-calendar-month")].map(measureBox);
  expect(second.top).toBeGreaterThanOrEqual(first.bottom);
});
