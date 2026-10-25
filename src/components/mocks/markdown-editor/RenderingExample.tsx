import { MarkdownViewer } from "@/components/markdown-editor";
import { FULL_SYNTAX_SAMPLE } from "./markdown-samples";

const RENDER_OPTIONS = { idPrefix: "rendering" };

export const RenderingExample = () => (
  <div className="gdy-thin-scroll grid gap-4 lg:grid-cols-2">
    <pre className="gdy-scroll max-h-[640px] overflow-auto rounded-md border bg-muted p-3 text-xs" aria-label="Markdown de origen">
      {FULL_SYNTAX_SAMPLE}
    </pre>
    <div className="gdy-scroll max-h-[640px] overflow-auto rounded-md border p-4">
      <MarkdownViewer value={FULL_SYNTAX_SAMPLE} aria-label="Vista previa" renderOptions={RENDER_OPTIONS} />
    </div>
  </div>
);
