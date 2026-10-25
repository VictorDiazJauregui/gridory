/** The part of the Mermaid API the editor uses, so the library does not depend on Mermaid's own types. */
export interface MermaidRenderer {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, text: string) => Promise<{ svg: string }>;
}

/** Draws the `mermaid` code blocks of the preview. `mermaidDiagrams` from `gridory/markdown-editor/mermaid` is the ready-made one. */
export interface MarkdownDiagramRenderer {
  /** Loads Mermaid; called once, when the first diagram shows up. */
  load: () => Promise<{ default: MermaidRenderer }>;
}
