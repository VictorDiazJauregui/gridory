import type { CSSProperties } from "react";
import { MarkdownEditor, type MarkdownGuideConfig, type MarkdownToolbarItem } from "@/components/markdown-editor";

const REDUCED_TOOLS: readonly MarkdownToolbarItem[] = ["bold", "italic", "|", "bulletList", "link", "table", "|", "guide"];

const GUIDE: MarkdownGuideConfig = {
  sections: (defaults) => [
    ...defaults,
    {
      id: "signature",
      tab: "write",
      title: "Firma del equipo",
      description: "Una sección propia de la app: cierra cada nota con la firma.",
      examples: ["— *Equipo de soporte*"],
      toolIds: [],
    },
  ],
};

const EDITOR_HEIGHT = { "--gdy-md-editor-height": "14rem" } as CSSProperties;

export const GuideExample = () => (
  <div style={EDITOR_HEIGHT}>
    <MarkdownEditor defaultValue="Tocá **Guía de Markdown** (el signo de pregunta) para ver solo lo que esta barra escribe." tools={REDUCED_TOOLS} guide={GUIDE} />
  </div>
);
