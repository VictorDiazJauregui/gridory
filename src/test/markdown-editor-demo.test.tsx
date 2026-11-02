import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { MarkdownEditorMock } from "../components/mocks/markdown-editor/MarkdownEditor.mock";
import { MARKDOWN_EDITOR_DEMO_SECTIONS } from "../components/mocks/markdown-editor/markdown-editor-sections";

// This test checks the sections, not the drawings, and loading the real Mermaid and KaTeX costs seconds.
vi.mock("mermaid", () => ({ default: { initialize: () => {}, render: async () => ({ svg: "<svg></svg>" }) } }));
vi.mock("katex", () => ({ default: { renderToString: (tex: string) => tex } }));

test("renders the markdown editor demo sections and the event log", () => {
  render(<MarkdownEditorMock />);
  expect(screen.getByRole("heading", { level: 2, name: "Editor Markdown" })).toBeInTheDocument();
  for (const section of MARKDOWN_EDITOR_DEMO_SECTIONS) {
    expect(screen.getByRole("region", { name: section.title })).toBeInTheDocument();
  }
  expect(screen.getByRole("complementary")).toHaveTextContent("Eventos emitidos");
});
