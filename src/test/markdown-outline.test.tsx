import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import { buildOutlineTree, findActiveHeading } from "../components/markdown-editor/outline/outline-tree";
import { readMarkdownHeadings } from "../components/markdown-editor/render/read-headings";

const DOCUMENT = "# Guía\n\nTexto\n\n## Instalar **rápido**\n\n### Con `npm`\n\n## Usar\n\n```md\n# no es título\n```\n\n#### Detalle";

test("reads every heading with its level, preview id and source line", () => {
  expect(readMarkdownHeadings(DOCUMENT, { idPrefix: "doc" })).toEqual([
    { level: 1, text: "Guía", id: "doc-guía", line: 1 },
    { level: 2, text: "Instalar rápido", id: "doc-instalar-rápido", line: 5 },
    { level: 3, text: "Con npm", id: "doc-con-npm", line: 7 },
    { level: 2, text: "Usar", id: "doc-usar", line: 9 },
    { level: 4, text: "Detalle", id: "doc-detalle", line: 15 },
  ]);
});

test("nests each heading under the closest higher one, even when levels are skipped", () => {
  const tree = buildOutlineTree(readMarkdownHeadings(DOCUMENT));
  expect(tree.map((node) => node.heading.text)).toEqual(["Guía"]);
  expect(tree[0].children.map((node) => node.heading.text)).toEqual(["Instalar rápido", "Usar"]);
  expect(tree[0].children[1].children.map((node) => node.heading.text)).toEqual(["Detalle"]);
});

test.each([
  { topLine: 1, expected: "Guía" },
  { topLine: 6.2, expected: "Instalar rápido" },
  { topLine: 8.6, expected: "Usar" },
  { topLine: Number.POSITIVE_INFINITY, expected: "Detalle" },
])("marks «$expected» as visible with the top line at $topLine", ({ topLine, expected }) => {
  expect(findActiveHeading(readMarkdownHeadings(DOCUMENT), topLine)?.text).toBe(expected);
});

test("opens and closes the outline from its tool", async () => {
  const onOutlineChange = vi.fn();
  render(<MarkdownEditor defaultValue={DOCUMENT} onOutlineChange={onOutlineChange} />);
  const tool = screen.getByRole("button", { name: "Índice" });
  expect(screen.queryByRole("navigation", { name: "Índice" })).toBeNull();
  await userEvent.click(tool);
  const outline = screen.getByRole("navigation", { name: "Índice" });
  expect(tool).toHaveAttribute("aria-pressed", "true");
  expect(within(outline).getAllByRole("button").map((item) => item.textContent)).toEqual(["Guía", "Instalar rápido", "Con npm", "Usar", "Detalle"]);
  await userEvent.click(tool);
  expect(screen.queryByRole("navigation", { name: "Índice" })).toBeNull();
  expect(onOutlineChange.mock.calls).toEqual([[true], [false]]);
});

test("follows the controlled prop and says when there are no headings", () => {
  const { rerender } = render(<MarkdownEditor defaultValue="Solo texto" showOutline />);
  expect(within(screen.getByRole("navigation", { name: "Índice" })).getByText("El documento todavía no tiene títulos.")).toBeInTheDocument();
  rerender(<MarkdownEditor defaultValue="Solo texto" showOutline={false} />);
  expect(screen.queryByRole("navigation", { name: "Índice" })).toBeNull();
});
