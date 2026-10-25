import { render, screen, waitFor, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { insertFormula } from "../components/markdown-editor/commands/insert-formula";
import type { KatexRenderer, MarkdownFormulaRenderer } from "../components/markdown-editor/formulas/formula-types";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import { renderMarkdown, renderMarkdownWith } from "../components/markdown-editor/render/render-markdown";
import { MarkdownViewer } from "../components/markdown-editor/viewer/MarkdownViewer";

const renderWithMath = (markdown: string) => {
  const container = document.createElement("div");
  container.innerHTML = renderMarkdownWith(markdown, {}, { math: true });
  return container;
};

const readFormulas = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>(".gdy-md-math")].map((formula) => `${formula.dataset.math}:${formula.textContent}`);

const createFakeKatex = (): KatexRenderer => ({
  renderToString: vi.fn((tex: string, options: Record<string, unknown>) => {
    if (tex.includes("{$") || tex.endsWith("{")) throw new Error("KaTeX parse error: Unexpected end of input");
    return `<span class="katex" data-display="${String(options.displayMode)}"><script>alert(1)</script>${tex}</span>`;
  }),
});

const createRenderer = (katex: KatexRenderer): MarkdownFormulaRenderer => ({ load: vi.fn(async () => ({ default: katex })) });

test.each([
  { markdown: "La energía es $E = mc^2$.", formulas: ["inline:E = mc^2"] },
  { markdown: "En línea y grande: $$a + b$$", formulas: ["display:a + b"] },
  { markdown: "$$\n\\frac{1}{3}\n$$", formulas: ["display:\\frac{1}{3}"] },
  { markdown: "$$x^2$$", formulas: ["display:x^2"] },
  { markdown: "```math\n\\sum k\n```", formulas: ["display:\\sum k"] },
  { markdown: "La entrada cuesta $5 y la cena $10.", formulas: [] },
  { markdown: "Precio \\$x$ sin fórmula", formulas: [] },
  { markdown: "Un $ suelto y otro $ más", formulas: [] },
  { markdown: "`$no$` en código", formulas: [] },
])("finds $formulas.length formulas in «$markdown»", ({ markdown, formulas }) => {
  expect(readFormulas(renderWithMath(markdown))).toEqual(formulas);
});

test("keeps the block formula aligned with its source line", () => {
  const block = renderWithMath("Texto\n\n$$\nx\n$$").querySelector(".gdy-md-math-block");
  expect(block).toHaveAttribute("data-source-line", "3");
});

test("leaves the dollars as text when nothing draws formulas", () => {
  expect(renderMarkdown("La energía es $E = mc^2$.")).toBe('<p data-source-line="1">La energía es $E = mc^2$.</p>\n');
});

test("draws inline and block formulas, sanitized, loading KaTeX once", async () => {
  const katex = createFakeKatex();
  const formulas = createRenderer(katex);
  render(<MarkdownViewer value={"Uno $a$ y $b$\n\n$$\nc\n$$"} aria-label="Nota" formulas={formulas} />);
  const region = screen.getByRole("region", { name: "Nota" });
  await waitFor(() => expect(region.querySelectorAll('[data-math-state="ready"]')).toHaveLength(3));
  expect(region.querySelectorAll(".katex")).toHaveLength(3);
  expect(region.querySelector("script")).toBeNull();
  expect(region.querySelector(".gdy-md-math-block .katex")).toHaveAttribute("data-display", "true");
  expect(formulas.load).toHaveBeenCalledTimes(1);
});

test("marks a broken formula and explains the error without touching the rest", async () => {
  render(<MarkdownViewer value={"Bien $x$ y mal $\\frac{1}{$.\n\n$$\n\\sqrt{\n$$"} aria-label="Nota" formulas={createRenderer(createFakeKatex())} />);
  const region = screen.getByRole("region", { name: "Nota" });
  await waitFor(() => expect(region.querySelectorAll('[data-math-state="error"]')).toHaveLength(2));
  const [inline, block] = region.querySelectorAll<HTMLElement>('[data-math-state="error"]');
  expect(inline).toHaveAttribute("title", "La fórmula tiene un error: KaTeX parse error: Unexpected end of input");
  expect(inline.querySelector(".gdy-md-math-source")).toHaveTextContent("\\frac{1}{");
  expect(within(block).getByText("La fórmula tiene un error: KaTeX parse error: Unexpected end of input")).toBeInTheDocument();
  expect(region.querySelector('[data-math-state="ready"]')).toHaveTextContent("x");
});

test("offers the formula tool only when the app passes a formula renderer", () => {
  const { rerender } = render(<MarkdownEditor />);
  expect(screen.queryByRole("button", { name: "Fórmula" })).toBeNull();
  rerender(<MarkdownEditor formulas={createRenderer(createFakeKatex())} />);
  expect(screen.getByRole("button", { name: "Fórmula" })).toBeInTheDocument();
});

test.each([
  { text: "Área x^2", selection: { from: 5, to: 8 }, changes: [{ from: 5, to: 8, insert: "$x^2$" }], selected: { from: 6, to: 9 } },
  { text: "", selection: { from: 0, to: 0 }, changes: [{ from: 0, to: 0, insert: "$$\nE = mc^2\n$$\n\n" }], selected: { from: 3, to: 11 } },
])("inserts a formula for the selection «$text»", ({ text, selection, changes, selected }) => {
  expect(insertFormula({ text, selection })).toEqual({ changes, selection: selected });
});
