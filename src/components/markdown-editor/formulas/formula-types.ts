/** The part of the KaTeX API the editor uses, so the library does not depend on KaTeX's own types. */
export interface KatexRenderer {
  renderToString: (tex: string, options: Record<string, unknown>) => string;
}

/** Draws `$…$` and `$$…$$` formulas. `katexFormulas` from `gridory/markdown-editor/katex` is the ready-made one. */
export interface MarkdownFormulaRenderer {
  /** Loads KaTeX and its stylesheet; called once, when the first formula shows up. */
  load: () => Promise<{ default: KatexRenderer }>;
}
