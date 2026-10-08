import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import { PreviewSurface } from "./PreviewSurface";
import { useDefaultEnhancers } from "./use-default-enhancers";

export interface MarkdownPreviewProps {
  /** Accessible name of the preview; `texts.previewLabel` when left out. */
  "aria-label"?: string;
  className?: string;
}

export const MarkdownPreview = ({ className, "aria-label": label }: MarkdownPreviewProps) => {
  const { value, renderOptions, texts, codeLanguages, diagrams, formulas } = useMarkdownEditorContext("MarkdownPreview");
  const enhancers = useDefaultEnhancers({ codeLanguages, diagrams, formulas, renderOptions });
  return (
    <PreviewSurface
      value={value}
      renderOptions={renderOptions}
      className={className}
      aria-label={label ?? texts.previewLabel}
      enhancers={enhancers}
      recognizesMath={Boolean(formulas)}
    />
  );
};
