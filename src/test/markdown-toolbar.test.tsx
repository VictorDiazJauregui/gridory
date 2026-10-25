import { Bold, Hand } from "lucide-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import type { MarkdownTool } from "../components/markdown-editor/tools/tool-types";

test("renders the default toolbar with undo and redo disabled until there is history", () => {
  render(<MarkdownEditor />);
  const toolbar = screen.getByRole("toolbar", { name: "Herramientas de formato" });
  expect(toolbar).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Deshacer" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Rehacer" })).toBeDisabled();
});

test("runs a custom tool with the editor state", async () => {
  const run = vi.fn();
  const tool: MarkdownTool = { id: "mine", label: "Mi herramienta", icon: Bold, run };
  render(<MarkdownEditor defaultValue="hola" tools={[tool]} />);
  await userEvent.click(screen.getByRole("button", { name: "Mi herramienta" }));
  expect(run).toHaveBeenCalledWith(expect.objectContaining({ editor: expect.objectContaining({ value: "hola" }) }));
});

test("opens a menu tool and runs the chosen item", async () => {
  const run = vi.fn();
  const tool: MarkdownTool = { id: "menu", label: "Saludos", icon: Hand, items: [{ id: "hi", label: "Hola", run }] };
  render(<MarkdownEditor tools={[tool]} />);
  await userEvent.click(screen.getByRole("button", { name: "Saludos" }));
  await userEvent.click(await screen.findByRole("menuitem", { name: "Hola" }));
  expect(run).toHaveBeenCalledTimes(1);
});

test("places the toolbar above the source only, or leaves it out", () => {
  const { container, rerender } = render(<MarkdownEditor toolbarPlacement="source" />);
  expect(container.querySelector(".gdy-md-source-panel [role='toolbar']")).not.toBeNull();
  expect(container.querySelector(".gdy-md-header [role='toolbar']")).toBeNull();
  rerender(<MarkdownEditor toolbarPlacement="none" />);
  expect(screen.queryByRole("toolbar")).toBeNull();
});
