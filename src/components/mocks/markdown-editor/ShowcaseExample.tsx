import { MarkdownEditor } from "@/components/markdown-editor";
import { mermaidDiagrams } from "@/markdown-editor-mermaid";
import { katexFormulas } from "@/markdown-editor-katex";
import { SHOWCASE_SAMPLE } from "./markdown-samples";

const RENDER_OPTIONS = { idPrefix: "showcase" };

export const ShowcaseExample = () => (
  <MarkdownEditor
    defaultValue={SHOWCASE_SAMPLE}
    diagrams={mermaidDiagrams}
    formulas={katexFormulas}
    defaultShowOutline
    renderOptions={RENDER_OPTIONS}
  />
);
