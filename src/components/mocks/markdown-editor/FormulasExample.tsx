import { MarkdownEditor } from "@/components/markdown-editor";
import { katexFormulas } from "@/markdown-editor-katex";
import { FORMULAS_SAMPLE } from "./markdown-samples";

const RENDER_OPTIONS = { idPrefix: "formulas" };

export const FormulasExample = () => <MarkdownEditor defaultValue={FORMULAS_SAMPLE} formulas={katexFormulas} renderOptions={RENDER_OPTIONS} />;
