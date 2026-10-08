import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MarkdownEditorMock } from "../components/mocks/markdown-editor/MarkdownEditor.mock";
import { MARKDOWN_EDITOR_DEMO_SECTIONS } from "../components/mocks/markdown-editor/markdown-editor-sections";

test("renders the markdown editor demo sections and the event log", () => {
  render(<MarkdownEditorMock />);
  expect(screen.getByRole("heading", { level: 2, name: "Editor Markdown" })).toBeInTheDocument();
  for (const section of MARKDOWN_EDITOR_DEMO_SECTIONS) {
    expect(screen.getByRole("region", { name: section.title })).toBeInTheDocument();
  }
  expect(screen.getByRole("complementary")).toHaveTextContent("Eventos emitidos");
});
