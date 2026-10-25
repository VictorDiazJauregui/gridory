import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import type { MarkdownDiagramRenderer, MermaidRenderer } from "../components/markdown-editor/diagrams/diagram-types";
import { PREVIEW_CONTENT_CHANGE_EVENT } from "../components/markdown-editor/preview/preview-enhancer";
import { MarkdownViewer } from "../components/markdown-editor/viewer/MarkdownViewer";

const DIAGRAM = "```mermaid\nflowchart LR\n  A --> B\n```";
const toDiagram = (edge: string) => `\`\`\`mermaid\nflowchart LR\n  ${edge}\n\`\`\``;
const BROKEN_DIAGRAM = "```mermaid\nflowchart LR\n  A -->\n```";

const UNSAFE_SVG = '<svg id="drawn"><g><rect width="10" height="10"></rect><foreignObject><div>html</div></foreignObject><script>alert(1)</script></g></svg>';

const createFakeMermaid = (): MermaidRenderer => ({
  initialize: vi.fn(),
  render: vi.fn(async (_id: string, text: string) => {
    if (text.includes("-->\n") || text.trim().endsWith("-->")) throw new Error("Parse error on line 2");
    return { svg: UNSAFE_SVG };
  }),
});

const createRenderer = (mermaid: MermaidRenderer): MarkdownDiagramRenderer => ({ load: vi.fn(async () => ({ default: mermaid })) });

const renderViewer = (value: string, diagrams?: MarkdownDiagramRenderer) =>
  render(<MarkdownViewer value={value} aria-label="Nota" diagrams={diagrams} />);

const findDiagram = async (state: string) => {
  const region = screen.getByRole("region", { name: "Nota" });
  await waitFor(() => expect(region.querySelector(`[data-diagram-state="${state}"]`)).not.toBeNull(), { timeout: 2000 });
  return region.querySelector(".gdy-md-diagram") as HTMLElement;
};

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

test("leaves mermaid blocks as code when no renderer is given", () => {
  renderViewer(DIAGRAM);
  const region = screen.getByRole("region", { name: "Nota" });
  expect(region.querySelector('pre[data-language="mermaid"]')).toHaveTextContent("flowchart LR");
  expect(region.querySelector(".gdy-md-diagram")).toBeNull();
});

test("draws a sanitized diagram in place of the block, keeping its source line", async () => {
  const mermaid = createFakeMermaid();
  renderViewer(`Texto\n\n${DIAGRAM}`, createRenderer(mermaid));
  expect(screen.getByRole("figure", { name: "Diagrama" })).toHaveAttribute("aria-busy", "true");
  const figure = await findDiagram("ready");
  expect(figure).toHaveAttribute("data-source-line", "3");
  expect(figure.querySelector("svg rect")).not.toBeNull();
  expect(figure.querySelector("foreignObject, script")).toBeNull();
  expect(within(figure).getByRole("button", { name: "Ver a tamaño completo" })).toBeInTheDocument();
  expect(mermaid.initialize).toHaveBeenCalledWith(expect.objectContaining({ securityLevel: "strict", htmlLabels: false }));
});

test("shows the syntax error inside the block and keeps the code", async () => {
  renderViewer(BROKEN_DIAGRAM, createRenderer(createFakeMermaid()));
  const figure = await findDiagram("error");
  expect(within(figure).getByRole("alert")).toHaveTextContent("No se pudo dibujar el diagramaParse error on line 2");
  expect(figure.querySelector(".gdy-md-diagram-source")).toHaveTextContent("A -->");
});

test("reuses a drawn diagram while the rest of the document changes", async () => {
  const mermaid = createFakeMermaid();
  const diagrams = createRenderer(mermaid);
  const diagram = toDiagram("C --> D");
  const { rerender } = renderViewer(`Uno\n\n${diagram}\n`, diagrams);
  await findDiagram("ready");
  rerender(<MarkdownViewer value={`Dos\n\n${diagram}\n`} aria-label="Nota" diagrams={diagrams} />);
  expect(screen.getByRole("region", { name: "Nota" }).querySelector('[data-diagram-state="ready"]')).not.toBeNull();
  expect(mermaid.render).toHaveBeenCalledTimes(1);
  expect(diagrams.load).toHaveBeenCalledTimes(1);
});

test("says when Mermaid could not be loaded and tries again on the next change", async () => {
  const diagrams: MarkdownDiagramRenderer = { load: vi.fn().mockRejectedValueOnce(new Error("Failed to fetch")).mockResolvedValue({ default: createFakeMermaid() }) };
  const diagram = toDiagram("E --> F");
  const { rerender } = renderViewer(`${diagram}\n\nUno`, diagrams);
  expect(within(await findDiagram("error")).getByRole("alert")).toHaveTextContent("Failed to fetch");
  rerender(<MarkdownViewer value={`${diagram}\n\nDos`} aria-label="Nota" diagrams={diagrams} />);
  await findDiagram("ready");
  expect(diagrams.load).toHaveBeenCalledTimes(2);
});

test("tells the synced scroll once a diagram finishes drawing, not when it comes from the cache", async () => {
  const diagrams = createRenderer(createFakeMermaid());
  const diagram = toDiagram("G --> H");
  const { rerender } = renderViewer(diagram, diagrams);
  const region = screen.getByRole("region", { name: "Nota" });
  const onContentChange = vi.fn();
  region.addEventListener(PREVIEW_CONTENT_CHANGE_EVENT, onContentChange);
  await findDiagram("ready");
  rerender(<MarkdownViewer value={`${diagram}\n\nOtro párrafo`} aria-label="Nota" diagrams={diagrams} />);
  expect(onContentChange).toHaveBeenCalledTimes(1);
});
