import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import type { MarkdownEditorView } from "../components/markdown-editor/types";

const readPanels = (container: HTMLElement) => ({
  view: container.querySelector(".gdy-md-panels")?.getAttribute("data-view"),
  source: !container.querySelector<HTMLElement>(".gdy-md-source-panel")?.hidden,
  preview: !container.querySelector<HTMLElement>(".gdy-md-preview-panel")?.hidden,
});

test("starts in the split view and switches views from the group", async () => {
  const onViewChange = vi.fn();
  const { container } = render(<MarkdownEditor defaultValue="# Hola" onViewChange={onViewChange} />);
  expect(readPanels(container)).toEqual({ view: "split", source: true, preview: true });
  await userEvent.click(screen.getByRole("button", { name: "Vista previa" }));
  expect(readPanels(container)).toEqual({ view: "preview", source: false, preview: true });
  expect(screen.getByRole("button", { name: "Vista previa" })).toHaveAttribute("aria-pressed", "true");
  expect(onViewChange).toHaveBeenCalledWith("preview");
});

test("renders the preview of the current value with its name", () => {
  render(<MarkdownEditor defaultValue="# Hola" />);
  const preview = screen.getByRole("region", { name: "Vista previa" });
  expect(preview.querySelector("h1")?.textContent).toBe("Hola");
});

const ControlledViews = () => {
  const [view, setView] = useState<MarkdownEditorView>("source");
  return <MarkdownEditor view={view} onViewChange={setView} views={["source", "preview"]} />;
};

test("follows a controlled view and offers only the given views", async () => {
  const { container } = render(<ControlledViews />);
  expect(readPanels(container).view).toBe("source");
  expect(screen.queryByRole("button", { name: "Dividida" })).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: "Vista previa" }));
  expect(readPanels(container).view).toBe("preview");
});

test("hides the switch when only one view is allowed", () => {
  const { container } = render(<MarkdownEditor views={["preview"]} />);
  expect(screen.queryByRole("group", { name: "Vista" })).toBeNull();
  expect(readPanels(container).view).toBe("preview");
});
