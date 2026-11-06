import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable, type CellHighlight, type ColumnDefinition } from "../components/table";
import { SimpleSelect } from "../components/ui/select/select";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, applyTheme, type ScreenName, type Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";

interface Scenario {
  theme: Theme;
  screen: ScreenName;
}

interface StatusRow {
  id: string;
  status: string;
}

const SCENARIOS: Scenario[] = [
  { theme: "light", screen: "desktop" },
  { theme: "dark", screen: "desktop" },
  { theme: "light", screen: "iphone14Pro" },
  { theme: "dark", screen: "pixel7" },
];

const OPTIONS = [
  { value: "short", label: "Mostrar: Todos" },
  { value: "long", label: "Mostrar: Archivados y activos de todos los países" },
];

// 1.5.0 drew the box as padding 10px + label + 6px gap + 14px icon + padding 10px, inside a 1px border.
const BOX_CHROME_WIDTH = 42;
const PILL_GREEN = "rgb(220, 252, 231)";
const PILL_TEXT = "rgb(22, 101, 52)";
const PILL: CellHighlight = { style: { background: PILL_GREEN, color: PILL_TEXT, borderRadius: 6, padding: "4px 8px" } };

const COLUMNS: ColumnDefinition<StatusRow>[] = [
  {
    id: "status",
    header: "Estado",
    accessor: (row) => row.status,
    inlineEditOptions: [{ value: "Activa", label: "Activa" }, { value: "Pendiente", label: "Pendiente" }],
    onInlineEdit: () => undefined,
    valueHighlights: { Activa: PILL },
  },
];

const applyScenario = async ({ theme, screen: screenName }: Scenario) => {
  applyTheme(theme);
  await applyScreen(screenName);
};

const measureLabelWidth = (label: string) => {
  const probe = document.createElement("span");
  probe.className = "gdy-scope";
  probe.style.cssText = "position: absolute; font-size: 0.875rem; white-space: nowrap";
  probe.textContent = label;
  document.body.append(probe);
  const { width } = probe.getBoundingClientRect();
  probe.remove();
  return width;
};

test.each(SCENARIOS)("in $theme on $screen the closed box fits the chosen option, as in 1.5.0", async (scenario) => {
  await applyScenario(scenario);
  render(<div className="gdy-scope"><SimpleSelect options={OPTIONS} value="short" onValueChange={() => undefined} ariaLabel="Mostrar" /></div>);
  const select = screen.getByRole("combobox", { name: "Mostrar" });
  const box = select.getBoundingClientRect();
  expect(box.width).toBeCloseTo(measureLabelWidth("Mostrar: Todos") + BOX_CHROME_WIDTH, 0);
  expect(measureBox(select).height).toBe(32);
  const icon = measureBox(findRequiredElement(document.body, ".gdy-select-icon"));
  expect(icon.right).toBe(Math.round(box.right) - 11);
});

test.each(SCENARIOS)("in $theme on $screen the Estado pill paints the whole closed box", async (scenario) => {
  await applyScenario(scenario);
  const { container } = render(<DataTable columns={COLUMNS} data={[{ id: "1", status: "Activa" }]} getRowId={(row) => row.id} />);
  const select = findRequiredElement(container, ".gdy-table-inline-select");
  const cell = measureBox(findRequiredElement(container, ".gdy-table-inline-select-wrap"));
  expect(readStyle(select, "background-color")).toBe(PILL_GREEN);
  expect(readStyle(select, "color")).toBe(PILL_TEXT);
  expect(readStyle(findRequiredElement(container, ".gdy-select"), "background-color")).toBe("rgba(0, 0, 0, 0)");
  expect(measureBox(select).width).toBe(cell.width);
  expect(measureBox(select).height).toBe(28);
});

test("in dark the system list follows the theme", () => {
  applyTheme("dark");
  render(<SimpleSelect options={OPTIONS} value="short" onValueChange={() => undefined} ariaLabel="Mostrar" />);
  expect(readStyle(screen.getByRole("combobox", { name: "Mostrar" }), "color-scheme")).toBe("dark");
});
