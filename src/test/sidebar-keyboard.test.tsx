import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import type { MockInstance } from "vitest";
import { findSidebarRoot, renderSidebar } from "./sidebar/render-sidebar";
import type { SidebarFixtureOptions } from "./sidebar/render-sidebar";

// Real timers on purpose: the tooltip positions itself asynchronously, and fake
// timers that advance on their own let that update land while Testing Library
// has the act environment switched off, which React reports as a warning.
// The guard turns any such warning into a failure instead of log noise.
let consoleError: MockInstance<typeof console.error>;

beforeEach(() => {
  consoleError = vi.spyOn(console, "error");
});

afterEach(() => {
  expect(consoleError).not.toHaveBeenCalled();
  consoleError.mockRestore();
});

const setup = (options: SidebarFixtureOptions = {}) => {
  const user = userEvent.setup();
  const { container } = renderSidebar(options);
  const state = () => findSidebarRoot(container)?.getAttribute("data-state");
  return { user, container, state };
};

// Without delays, the pointer's effect depends only on the mode, never on timing.
const WITHOUT_DELAYS = { hoverOpenDelay: 0, hoverCloseDelay: 0 };

test("keyboard focus inside expands it; Escape collapses it and keeps the focus where it was", async () => {
  const { user, state } = setup();
  await user.tab();
  expect(screen.getByRole("button", { name: "Fijar menú" })).toHaveFocus();
  expect(state()).toBe("expanded");
  await user.tab();
  await user.keyboard("{Escape}");
  expect(state()).toBe("collapsed");
  expect(screen.getByRole("button", { name: "Inicio" })).toHaveFocus();
});

test("tabbing out of the sidebar collapses it", async () => {
  const { user, state } = setup();
  await user.tab();
  await user.tab();
  await user.tab();
  await user.tab();
  expect(screen.getByRole("button", { name: "Ajustes" })).toHaveFocus();
  expect(state()).toBe("expanded");
  await user.tab();
  expect(state()).toBe("collapsed");
});

test("without hover expansion, the pointer does not expand it and each icon gets a tooltip", async () => {
  const { user, container, state } = setup({ layout: { expandOnHover: false, ...WITHOUT_DELAYS } });
  await user.hover(container.querySelector(".gdy-sidebar-panel") as HTMLElement);
  await user.hover(screen.getByRole("button", { name: "Clientes" }));
  expect(await screen.findByRole("tooltip")).toHaveTextContent("Clientes");
  expect(state()).toBe("collapsed");
});

test("without hover expansion, the button expands and collapses by hand", async () => {
  const { user, state } = setup({ layout: { expandOnHover: false } });
  const expand = screen.getByRole("button", { name: "Expandir menú" });
  expect(expand).toHaveAttribute("aria-expanded", "false");
  await user.click(expand);
  expect(state()).toBe("expanded");
  expect(screen.getByRole("button", { name: "Colapsar menú" })).toHaveAttribute("aria-expanded", "true");
});

test("no tooltip while hover expansion is on: expanding already names every icon", async () => {
  const { user, state } = setup({ layout: WITHOUT_DELAYS });
  await user.hover(screen.getByRole("button", { name: "Clientes" }));
  await waitFor(() => expect(state()).toBe("expanded"));
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});
