import { MarkdownViewer } from "@/components/markdown-editor";
import { SAVED_NOTE_SAMPLE } from "./markdown-samples";

const RENDER_OPTIONS = { idPrefix: "viewer" };

export const ViewerExample = () => (
  <article className="max-w-2xl rounded-md border p-4">
    <MarkdownViewer value={SAVED_NOTE_SAMPLE} aria-label="Nota guardada" renderOptions={RENDER_OPTIONS} />
  </article>
);
