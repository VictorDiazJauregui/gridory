import { MarkdownEditor } from "@/components/markdown-editor";
import { mermaidDiagrams } from "@/markdown-editor-mermaid";
import { DIAGRAMS_SAMPLE } from "./markdown-samples";

const RENDER_OPTIONS = { idPrefix: "diagrams" };

export const DiagramsExample = () => (
  <MarkdownEditor defaultValue={DIAGRAMS_SAMPLE} diagrams={mermaidDiagrams} renderOptions={RENDER_OPTIONS} />
);
