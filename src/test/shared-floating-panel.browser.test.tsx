import type { CSSProperties } from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import {
  FloatingPanel,
  FloatingPanelAnchor,
  FloatingPanelContent,
  FloatingPanelTrigger,
} from "../components/shared/floating-panel/FloatingPanel";
import { FLOATING_PANEL_PLACEMENT } from "../components/shared/floating-panel/floating-panel-placement";
import { findRequiredElement } from "./browser/elements";
import { applyTheme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";

interface FieldHarnessProps {
  fieldStyle: CSSProperties;
  panelStyle?: CSSProperties;
  panelBodyHeight?: number;
}

interface WidthCase {
  field: string;
  fieldWidth: number;
  panelStyle?: CSSProperties;
  expectedWidth: number;
}

const FIELD_NEAR_TOP: CSSProperties = { position: "fixed", top: 40, left: 40, width: 240, height: 40 };
const FIELD_AT_BOTTOM_EDGE: CSSProperties = { position: "fixed", bottom: 8, left: 40, width: 240, height: 40 };
const FIELD_IN_FLOW: CSSProperties = { width: 240, height: 40 };
const SCROLLER: CSSProperties = { height: 300, marginLeft: 40, overflowY: "auto" };
const SCROLL_DISTANCE = 60;
const POPOVER_REFERENCE: CSSProperties = { width: 10, height: 10, backgroundColor: "var(--gdy-popover)" };
const TRANSPARENT = "rgba(0, 0, 0, 0)";
// 12rem, the default --gdy-floating-panel-min-width, at the 16px root font size.
const DEFAULT_MIN_WIDTH = 192;
// Lifts the default cap so only the height available on screen limits the panel.
const UNCAPPED_HEIGHT = { "--gdy-floating-panel-max-height": "2000px" } as CSSProperties;

const WIDTH_CASES: WidthCase[] = [
  { field: "a narrow field", fieldWidth: 100, expectedWidth: DEFAULT_MIN_WIDTH },
  { field: "a wide field", fieldWidth: 400, expectedWidth: 400 },
  {
    field: "a narrow field with a raised minimum",
    fieldWidth: 100,
    panelStyle: { "--gdy-floating-panel-min-width": "240px" } as CSSProperties,
    expectedWidth: 240,
  },
];

const keepOpen = () => undefined;

// Like the phone field: the panel aligns to the whole field, while the trigger
// is only the small prefix button inside it.
const FieldHarness = ({ fieldStyle, panelStyle, panelBodyHeight = 120 }: FieldHarnessProps) => (
  <FloatingPanel open onOpenChange={keepOpen}>
    <FloatingPanelAnchor>
      <div data-testid="field" style={fieldStyle}>
        <FloatingPanelTrigger>
          <button type="button">+51</button>
        </FloatingPanelTrigger>
      </div>
    </FloatingPanelAnchor>
    <FloatingPanelContent aria-label="Países" style={panelStyle}>
      <div className="gdy-scroll" style={{ height: panelBodyHeight }} />
    </FloatingPanelContent>
  </FloatingPanel>
);

const measureLayout = () => ({
  panel: measureBox(findRequiredElement(document.body, ".gdy-floating-panel")),
  field: measureBox(screen.getByTestId("field")),
});

const measureGapBelowField = () => {
  const { panel, field } = measureLayout();
  return panel.top - field.bottom;
};

const measureGapAboveField = () => {
  const { panel, field } = measureLayout();
  return field.top - panel.bottom;
};

// Floating UI positions the panel asynchronously and the opening animation
// scales it, so layout assertions wait until it rests at its offset.
const waitUntilPanelRestsBelowField = () =>
  expect.poll(measureGapBelowField).toBe(FLOATING_PANEL_PLACEMENT.sideOffset);

test("a field near the top of the screen opens the panel below it", async () => {
  render(<FieldHarness fieldStyle={FIELD_NEAR_TOP} />);
  await waitUntilPanelRestsBelowField();
  expect(findRequiredElement(document.body, ".gdy-floating-panel")).toHaveAttribute("data-side", "bottom");
  const { panel, field } = measureLayout();
  expect(panel.left).toBe(field.left);
});

test("a field pinned to the bottom edge opens the panel above it", async () => {
  render(<FieldHarness fieldStyle={FIELD_AT_BOTTOM_EDGE} />);
  await expect.poll(measureGapAboveField).toBe(FLOATING_PANEL_PLACEMENT.sideOffset);
  expect(findRequiredElement(document.body, ".gdy-floating-panel")).toHaveAttribute("data-side", "top");
});

test("the panel stays attached to the field when its container scrolls", async () => {
  render(
    <div data-testid="scroller" style={SCROLLER}>
      <div style={{ height: 100 }} />
      <FieldHarness fieldStyle={FIELD_IN_FLOW} />
      <div style={{ height: 1000 }} />
    </div>,
  );
  await waitUntilPanelRestsBelowField();
  const fieldTopBeforeScroll = measureLayout().field.top;
  screen.getByTestId("scroller").scrollTop = SCROLL_DISTANCE;
  expect(measureLayout().field.top).toBe(fieldTopBeforeScroll - SCROLL_DISTANCE);
  await waitUntilPanelRestsBelowField();
  const { panel, field } = measureLayout();
  expect(panel.left).toBe(field.left);
});

test.each(WIDTH_CASES)(
  "$field ($fieldWidth px) gets a $expectedWidth px panel",
  async ({ fieldWidth, panelStyle, expectedWidth }) => {
    render(<FieldHarness fieldStyle={{ ...FIELD_NEAR_TOP, width: fieldWidth }} panelStyle={panelStyle} />);
    await waitUntilPanelRestsBelowField();
    await expect.poll(() => measureLayout().panel.width).toBe(expectedWidth);
    expect(measureLayout().panel.width).toBeGreaterThanOrEqual(fieldWidth);
  },
);

test("a panel taller than the space below shrinks to stay on screen", async () => {
  render(<FieldHarness fieldStyle={FIELD_NEAR_TOP} panelStyle={UNCAPPED_HEIGHT} panelBodyHeight={1500} />);
  await waitUntilPanelRestsBelowField();
  expect(measureLayout().panel.bottom).toBeLessThanOrEqual(window.innerHeight);
});

test.each(["light", "dark"] as const)("the panel paints the %s popover token", async (theme) => {
  applyTheme(theme);
  render(
    <>
      <div data-testid="popover-reference" style={POPOVER_REFERENCE} />
      <FieldHarness fieldStyle={FIELD_NEAR_TOP} />
    </>,
  );
  const panel = await screen.findByRole("dialog", { name: "Países" });
  const referenceColor = readStyle(screen.getByTestId("popover-reference"), "background-color");
  expect(referenceColor).not.toBe(TRANSPARENT);
  expect(readStyle(panel, "background-color")).toBe(referenceColor);
});

test("a scrolling list inside the panel inherits the thin scrollbar", async () => {
  render(<FieldHarness fieldStyle={FIELD_NEAR_TOP} />);
  const panel = await screen.findByRole("dialog", { name: "Países" });
  expect(readStyle(findRequiredElement(panel, ".gdy-scroll"), "scrollbar-width")).toBe("thin");
});
