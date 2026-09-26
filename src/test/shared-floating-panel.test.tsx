import { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import type { AccessibleName } from "../components/shared/accessible-name";
import {
  FloatingPanel,
  FloatingPanelContent,
  FloatingPanelTrigger,
} from "../components/shared/floating-panel/FloatingPanel";
import { MissingFloatingPanelError } from "../components/shared/floating-panel/floating-panel-context";
import { expectRenderError } from "./expect-render-error";

interface PanelHarnessProps {
  portalContainer?: HTMLElement | null;
  accessibleName?: AccessibleName;
}

interface NamingCase {
  attribute: string;
  accessibleName: AccessibleName;
  expectedName: string;
}

const FIELD_LABEL_ID = "country-field-label";
const PANEL_LABEL: AccessibleName = { "aria-label": "Países" };

const NAMING_CASES: NamingCase[] = [
  { attribute: "aria-label", accessibleName: PANEL_LABEL, expectedName: "Países" },
  {
    attribute: "aria-labelledby",
    accessibleName: { "aria-labelledby": FIELD_LABEL_ID },
    expectedName: "País de residencia",
  },
];

const PanelHarness = ({ portalContainer, accessibleName = PANEL_LABEL }: PanelHarnessProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span id={FIELD_LABEL_ID}>País de residencia</span>
      <FloatingPanel open={open} onOpenChange={setOpen}>
        <FloatingPanelTrigger>
          <button type="button">País</button>
        </FloatingPanelTrigger>
        <FloatingPanelContent {...accessibleName} portalContainer={portalContainer}>
          <input aria-label="Buscar país" />
        </FloatingPanelContent>
      </FloatingPanel>
      <button type="button">Afuera</button>
    </>
  );
};

const PortalHostHarness = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  return (
    <>
      <div data-testid="portal-host" ref={setHost} />
      <PanelHarness portalContainer={host} />
    </>
  );
};

const openPanel = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "País" }));
  return { user, panel: await screen.findByRole("dialog", { name: "Países" }) };
};

const expectPanelClosed = () =>
  waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

test("clicking the trigger opens the panel and focuses its first field", async () => {
  render(<PanelHarness />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  const { panel } = await openPanel();
  expect(screen.getByRole("button", { name: "País" })).toHaveAttribute("aria-expanded", "true");
  expect(within(panel).getByRole("textbox", { name: "Buscar país" })).toHaveFocus();
});

test.each(NAMING_CASES)(
  "the panel dialog takes its accessible name from $attribute",
  async ({ accessibleName, expectedName }) => {
    render(<PanelHarness accessibleName={accessibleName} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "País" }));
    expect(screen.getByRole("dialog", { name: expectedName })).toBeInTheDocument();
  },
);

test.each([
  ["Escape", "{Escape}"],
  ["Tab", "{Tab}"],
  ["Shift+Tab", "{Shift>}{Tab}{/Shift}"],
])("%s closes the panel and returns the focus to the trigger", async (_key, keystroke) => {
  render(<PanelHarness />);
  const { user } = await openPanel();
  await user.keyboard(keystroke);
  await expectPanelClosed();
  expect(screen.getByRole("button", { name: "País" })).toHaveFocus();
});

test("a click outside closes the panel and leaves the focus where the click landed", async () => {
  render(<PanelHarness />);
  const { user } = await openPanel();
  await user.click(screen.getByRole("button", { name: "Afuera" }));
  await expectPanelClosed();
  expect(screen.getByRole("button", { name: "Afuera" })).toHaveFocus();
});

test("portalContainer mounts the panel inside the given element", async () => {
  render(<PortalHostHarness />);
  const { panel } = await openPanel();
  expect(screen.getByTestId("portal-host")).toContainElement(panel);
});

test("the panel root carries the scope and thin-scroll classes", async () => {
  render(<PanelHarness />);
  const { panel } = await openPanel();
  expect(panel).toHaveClass("gdy-scope", "gdy-thin-scroll", "gdy-floating-panel");
});

test("rendering the content outside a FloatingPanel fails with a descriptive error", () => {
  const orphanContent = <FloatingPanelContent aria-label="Países">Contenido</FloatingPanelContent>;
  expectRenderError(orphanContent, MissingFloatingPanelError);
});
