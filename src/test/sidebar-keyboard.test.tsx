import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { findSidebarRoot, renderSidebar } from "./sidebar/render-sidebar";
import type { SidebarFixtureOptions } from "./sidebar/render-sidebar";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

const setup = (options: SidebarFixtureOptions = {}) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const { container } = renderSidebar(options);
  const state = () => findSidebarRoot(container)?.getAttribute("data-state");
  return { user, container, state };
};

const wait = (milliseconds: number) => act(() => vi.advanceTimersByTime(milliseconds));

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
  const { user, container, state } = setup({ layout: { expandOnHover: false } });
  await user.hover(container.querySelector(".gdy-sidebar-panel") as HTMLElement);
  await wait(1000);
  expect(state()).toBe("collapsed");
  await user.hover(screen.getByRole("button", { name: "Clientes" }));
  await wait(10);
  expect(await screen.findByRole("tooltip")).toHaveTextContent("Clientes");
});

test("without hover expansion, the button expands and collapses by hand", async () => {
  const { user, state } = setup({ layout: { expandOnHover: false } });
  const expand = screen.getByRole("button", { name: "Expandir menú" });
  expect(expand).toHaveAttribute("aria-expanded", "false");
  await user.click(expand);
  expect(state()).toBe("expanded");
  expect(screen.getByRole("button", { name: "Colapsar menú" })).toHaveAttribute("aria-expanded", "true");
});

test("no tooltip while hover expansion is on, nor once expanded by hand", async () => {
  const { user } = setup();
  await user.hover(screen.getByRole("button", { name: "Clientes" }));
  await wait(1000);
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});
