import { Link2 } from "lucide-react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { MissingSidebarLayoutError, SidebarItem, SidebarLayout, useSidebar } from "../components/sidebar";
import { expectRenderError } from "./expect-render-error";
import { findSidebarRoot, renderSidebar } from "./sidebar/render-sidebar";

test("renders the header, the named navigation and the footer", () => {
  const { container } = renderSidebar();
  const navigation = screen.getByRole("navigation", { name: "Principal" });
  expect(within(navigation).getAllByRole("button")).toHaveLength(2);
  expect(container.querySelector(".gdy-sidebar-header")).toHaveTextContent("Gridory");
  expect(container.querySelector(".gdy-sidebar-footer")).toHaveTextContent("Ajustes");
  expect(screen.getByRole("main")).toHaveTextContent("Contenido");
});

test("marks only the active item as the current page and keeps every label as its name", () => {
  renderSidebar();
  expect(screen.getByRole("button", { name: "Inicio" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("button", { name: "Clientes" })).not.toHaveAttribute("aria-current");
});

test("separates items with a separator inside the navigation", () => {
  renderSidebar();
  const navigation = screen.getByRole("navigation", { name: "Principal" });
  expect(within(navigation).getByRole("separator")).toHaveClass("gdy-sidebar-separator");
});

test("emits onSelect when an item is clicked", async () => {
  const onSelect = vi.fn();
  renderSidebar({ onSelect });
  await userEvent.click(screen.getByRole("button", { name: "Clientes" }));
  expect(onSelect).toHaveBeenCalledWith("Clientes");
});

test("renders a router link with asChild, keeping the icon, the label and the current page", () => {
  render(
    <SidebarLayout>
      <SidebarItem icon={<Link2 />} label="Documentos" active asChild>
        <a href="/documentos" />
      </SidebarItem>
    </SidebarLayout>,
  );
  const link = screen.getByRole("link", { name: "Documentos" });
  expect(link).toHaveAttribute("href", "/documentos");
  expect(link).toHaveAttribute("aria-current", "page");
  expect(link).toHaveClass("gdy-sidebar-item");
  expect(link.querySelector(".gdy-sidebar-item-icon svg")).not.toBeNull();
});

test("starts collapsed and unpinned in the desktop form", () => {
  const { container } = renderSidebar();
  const root = findSidebarRoot(container);
  expect(root).toHaveAttribute("data-state", "collapsed");
  expect(root).toHaveAttribute("data-pinned", "false");
  expect(root).toHaveAttribute("data-mobile", "false");
});

test("fails with its own error when a part is used outside SidebarLayout", () => {
  const Probe = () => <span>{String(useSidebar().collapsed)}</span>;
  expectRenderError(<Probe />, MissingSidebarLayoutError);
  expectRenderError(<SidebarItem icon={<Link2 />} label="Suelto" />, MissingSidebarLayoutError);
});
