import type { MarkdownDiagramRenderer } from "./diagram-types";

export const mermaidDiagrams: MarkdownDiagramRenderer = {
  load: () => import("mermaid"),
};
