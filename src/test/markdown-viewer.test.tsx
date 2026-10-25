import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderMarkdown } from "../components/markdown-editor/render/render-markdown";
import { MarkdownViewer } from "../components/markdown-editor/viewer/MarkdownViewer";

const DOCUMENT = "# Title\n\n> [!NOTE]\n> Body\n\n- [x] done\n\n[x](javascript:alert(1))";

test("renders the sanitized HTML inside a named region", () => {
  render(<MarkdownViewer value={DOCUMENT} aria-label="Nota" />);
  const region = screen.getByRole("region", { name: "Nota" });
  expect(region).toHaveClass("gdy-md-preview", "gdy-md-viewer");
  expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
  expect(region.querySelector("a")).toBeNull();
});

test("shows exactly the HTML of renderMarkdown for the same text and options", () => {
  const options = { idPrefix: "same" };
  render(<MarkdownViewer value={DOCUMENT} renderOptions={options} aria-label="Nota" />);
  expect(screen.getByRole("region", { name: "Nota" }).innerHTML).toBe(renderMarkdown(DOCUMENT, options));
});

test("updates when the value changes", () => {
  const { rerender } = render(<MarkdownViewer value="first" />);
  rerender(<MarkdownViewer value="**second**" />);
  expect(screen.getByText("second").tagName).toBe("STRONG");
});
