import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { findSidebarRoot, renderSidebar } from "./sidebar/render-sidebar";
import type { SidebarFixtureOptions } from "./sidebar/render-sidebar";
import { RetainingBlock } from "./sidebar/RetainingBlock";

const OPEN_DELAY = 150;
const CLOSE_DELAY = 300;

// user-event needs the clock to keep moving on its own; the delays below leave
// half of each one as margin for that drift.
beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

const setup = (options: SidebarFixtureOptions = {}) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const { container } = renderSidebar(options);
  const panel = container.querySelector(".gdy-sidebar-panel") as HTMLElement;
  const state = () => findSidebarRoot(container)?.getAttribute("data-state");
  return { user, panel, state };
};

const wait = (milliseconds: number) => act(() => vi.advanceTimersByTime(milliseconds));

test("expands only after the open delay and collapses after the close delay", async () => {
  const { user, panel, state } = setup();
  await user.hover(panel);
  await wait(OPEN_DELAY / 2);
  expect(state()).toBe("collapsed");
  await wait(OPEN_DELAY / 2);
  expect(state()).toBe("expanded");
  await user.unhover(panel);
  await wait(CLOSE_DELAY / 2);
  expect(state()).toBe("expanded");
  await wait(CLOSE_DELAY / 2);
  expect(state()).toBe("collapsed");
});

test("crossing the rail quickly never expands it", async () => {
  const { user, panel, state } = setup();
  await user.hover(panel);
  await wait(OPEN_DELAY / 2);
  await user.unhover(panel);
  await wait(OPEN_DELAY + CLOSE_DELAY);
  expect(state()).toBe("collapsed");
});

test("the pin button pins and unpins, emitting each change", async () => {
  const onPinnedChange = vi.fn();
  const { user, state } = setup({ layout: { onPinnedChange } });
  await user.click(screen.getByRole("button", { name: "Fijar menú" }));
  expect(screen.getByRole("button", { name: "Soltar menú" })).toHaveAttribute("aria-pressed", "true");
  expect(state()).toBe("expanded");
  await user.click(screen.getByRole("button", { name: "Soltar menú" }));
  expect(onPinnedChange.mock.calls).toEqual([[true], [false]]);
});

test("works in the footer too, and controlled it only emits", async () => {
  const onPinnedChange = vi.fn();
  const { user, state } = setup({ pinPlacement: "footer", layout: { pinned: false, onPinnedChange } });
  await user.click(screen.getByRole("button", { name: "Fijar menú" }));
  expect(onPinnedChange).toHaveBeenCalledWith(true);
  expect(state()).toBe("collapsed");
});

test("a clicked item does not keep the sidebar open once the pointer leaves", async () => {
  const { user, panel, state } = setup();
  await user.hover(panel);
  await wait(OPEN_DELAY);
  await user.click(screen.getByRole("button", { name: "Clientes" }));
  await user.unhover(panel);
  await wait(CLOSE_DELAY);
  expect(state()).toBe("collapsed");
});

test("a retention keeps it expanded after the pointer leaves, until it is released", async () => {
  const { user, panel, state } = setup({ footerBlock: <RetainingBlock /> });
  await user.hover(panel);
  await wait(OPEN_DELAY);
  await user.click(screen.getByRole("button", { name: "Menú de cuenta" }));
  await user.unhover(panel);
  await wait(CLOSE_DELAY);
  expect(state()).toBe("expanded");
  await user.click(screen.getByRole("button", { name: "Menú de cuenta" }));
  expect(state()).toBe("collapsed");
});
