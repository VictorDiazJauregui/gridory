import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { renderSidebar } from "./sidebar/render-sidebar";

// jsdom has no matchMedia: this one answers like a phone to every width query.
const phoneMatchMedia = (query: string) => ({
  matches: query.includes("max-width"),
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn(phoneMatchMedia));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const openMenu = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Abrir menú" }));
  return screen.getByRole("dialog", { name: "Menú de navegación" });
};

test("renders a top bar with the menu button and the logo instead of the rail", () => {
  const { container } = renderSidebar();
  const menuButton = screen.getByRole("button", { name: "Abrir menú" });
  expect(menuButton).toHaveAttribute("aria-expanded", "false");
  expect(container.querySelector(".gdy-sidebar-mobile-bar")).toHaveTextContent("Logo");
  expect(container.querySelector(".gdy-sidebar-panel")).toBeNull();
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});

test("opens the drawer with the whole sidebar, without the pin button", async () => {
  renderSidebar();
  const drawer = await openMenu();
  // The open dialog hides the rest of the page from assistive technology.
  expect(screen.getByRole("button", { name: "Abrir menú", hidden: true })).toHaveAttribute("aria-expanded", "true");
  expect(within(drawer).getByRole("navigation", { name: "Principal" })).toBeInTheDocument();
  expect(within(drawer).getByRole("button", { name: "Ajustes" })).toBeInTheDocument();
  expect(within(drawer).queryByRole("button", { name: "Fijar menú" })).not.toBeInTheDocument();
});

test("choosing an item emits it, closes the drawer and gives the focus back to the menu button", async () => {
  const onSelect = vi.fn();
  renderSidebar({ onSelect });
  const drawer = await openMenu();
  await userEvent.click(within(drawer).getByRole("button", { name: "Clientes" }));
  expect(onSelect).toHaveBeenCalledWith("Clientes");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Abrir menú" })).toHaveFocus();
});

test("closes with the close button and with Escape", async () => {
  renderSidebar();
  await userEvent.click(within(await openMenu()).getByRole("button", { name: "Cerrar menú" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await openMenu();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
