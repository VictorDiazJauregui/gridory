import type { MarkdownFormulaRenderer } from "./formula-types";

export const katexFormulas: MarkdownFormulaRenderer = {
  load: async () => {
    const [katex] = await Promise.all([import("katex"), import("katex/dist/katex.min.css")]);
    return katex;
  },
};
