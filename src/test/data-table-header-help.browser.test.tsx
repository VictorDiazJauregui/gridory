import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { DataTable, type ColumnAlign, type ColumnDefinition } from "../components/table";
import { BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { readColorContrast } from "./browser/contrast";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, applyTheme, type Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";
import { emulateMediaType } from "./browser/print-media";

afterEach(async () => {
  applyTheme("light");
  await applyScreen("desktop");
});

const HELP = "Suma de los contratos vigentes, en su moneda";

const buildColumn = (id: string, align: ColumnAlign, extra: Partial<ColumnDefinition<BaselineRow>> = {}) => ({
  id,
  header: "Monto",
  accessor: (row: BaselineRow) => row.name,
  width: 160,
  align,
  ...extra,
});

const renderColumns = (columns: ColumnDefinition<BaselineRow>[]) =>
  render(<DataTable columns={columns} data={BASELINE_ROWS} getRowId={(row) => row.id} />).container;

const headerPart = (container: HTMLElement, id: string, selector: string) =>
  findRequiredElement(container, `th[data-column-id="${id}"] ${selector}`);

const lastIconRight = (container: HTMLElement, id: string) =>
  measureBox(headerPart(container, id, ".gdy-table-head-trigger > :last-child")).right -
  measureBox(headerPart(container, id, ".gdy-table-head-trigger").closest("th") as Element).right;

test('with align "right" the title and the sort icon keep the same right edge as a column without help', () => {
  const container = renderColumns([buildColumn("plain", "right"), buildColumn("help", "right", { headerTooltip: HELP })]);
  expect(lastIconRight(container, "help")).toBe(lastIconRight(container, "plain"));
  const help = measureBox(headerPart(container, "help", ".gdy-table-head-help"));
  expect(help.right).toBeLessThanOrEqual(measureBox(headerPart(container, "help", ".gdy-table-head-label")).left);
});

test.each(["left", "center"] as ColumnAlign[])('with align "%s" the icon sits after the title without covering it', (align) => {
  const container = renderColumns([buildColumn("help", align, { headerTooltip: HELP })]);
  const label = measureBox(headerPart(container, "help", ".gdy-table-head-label"));
  const help = measureBox(headerPart(container, "help", ".gdy-table-head-help"));
  expect(help.left).toBeGreaterThanOrEqual(label.right);
  const title = headerPart(container, "help", ".gdy-table-head-label");
  expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth);
});

test('"edge" puts the icon against the cell edge opposite the title', () => {
  const container = renderColumns([
    buildColumn("left", "left", { headerTooltip: HELP, headerTooltipPlacement: "edge" }),
    buildColumn("right", "right", { headerTooltip: HELP, headerTooltipPlacement: "edge" }),
  ]);
  const leftCell = measureBox(headerPart(container, "left", ".gdy-table-head-inner"));
  expect(measureBox(headerPart(container, "left", ".gdy-table-head-help")).right).toBe(leftCell.right);
  const rightCell = measureBox(headerPart(container, "right", ".gdy-table-head-inner"));
  expect(measureBox(headerPart(container, "right", ".gdy-table-head-help")).left).toBe(rightCell.left);
});

test("with printMode the help icon does not reach the paper", async () => {
  const container = render(
    <DataTable columns={[buildColumn("help", "left", { headerTooltip: HELP })]} data={BASELINE_ROWS} printMode="page" />,
  ).container;
  await emulateMediaType("print");
  expect(readStyle(headerPart(container, "help", ".gdy-table-head-help"), "display")).toBe("none");
  await emulateMediaType("screen");
});

test("the header row keeps its height with the icon", () => {
  const plain = renderColumns([buildColumn("plain", "left")]);
  const withHelp = renderColumns([buildColumn("help", "left", { headerTooltip: HELP })]);
  expect(measureBox(headerPart(withHelp, "help", "")).height).toBe(measureBox(headerPart(plain, "plain", "")).height);
});

test.each(["light", "dark"] as Theme[])("in %s the tooltip stays on screen on an iPhone and reads clearly", async (theme) => {
  applyTheme(theme);
  await applyScreen("iphone14Pro");
  renderColumns([buildColumn("help", "right", { headerTooltip: HELP, width: 120 })]);
  fireEvent.click(screen.getByRole("button", { name: "Ayuda sobre Monto" }));
  const tooltip = await screen.findByText(HELP, { selector: ".gdy-table-head-tooltip" });
  const box = measureBox(tooltip);
  expect(box.left).toBeGreaterThanOrEqual(0);
  expect(box.right).toBeLessThanOrEqual(window.innerWidth);
  expect(readColorContrast(readStyle(tooltip, "color"), readStyle(tooltip, "background-color"))).toBeGreaterThanOrEqual(4.5);
});
