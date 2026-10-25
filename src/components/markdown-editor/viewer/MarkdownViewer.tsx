import { cn } from "../../../lib/cn";
import type { AccessibleName } from "../../shared/accessible-name";
import { DEFAULT_CODE_LANGUAGES, type MarkdownCodeLanguage } from "../code/code-languages";
import type { MarkdownDiagramRenderer } from "../diagrams/diagram-types";
import type { MarkdownFormulaRenderer } from "../formulas/formula-types";
import { useDefaultEnhancers } from "../preview/use-default-enhancers";
import { PreviewSurface } from "../preview/PreviewSurface";
import type { MarkdownRenderOptions } from "../types";

export type MarkdownViewerProps = Partial<AccessibleName> & {
  /** The Markdown to show, exactly as the editor's preview shows it. */
  value: string;
  renderOptions?: MarkdownRenderOptions;
  /** Languages the code blocks are colored with; the editor's default list when left out. */
  codeLanguages?: readonly MarkdownCodeLanguage[];
  /** Draws `mermaid` code blocks as diagrams; pass `mermaidDiagrams` from `gridory/markdown-editor/mermaid`. */
  diagrams?: MarkdownDiagramRenderer;
  /** Draws `$…$` and `$$…$$` formulas; pass `katexFormulas` from `gridory/markdown-editor/katex`. */
  formulas?: MarkdownFormulaRenderer;
  className?: string;
};

export const MarkdownViewer = ({ className, codeLanguages = DEFAULT_CODE_LANGUAGES, diagrams, formulas, ...viewerProps }: MarkdownViewerProps) => {
  const enhancers = useDefaultEnhancers({ codeLanguages, diagrams, formulas, renderOptions: viewerProps.renderOptions });
  return <PreviewSurface {...viewerProps} className={cn("gdy-md-viewer", className)} enhancers={enhancers} recognizesMath={Boolean(formulas)} />;
};
