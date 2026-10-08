import { useMemo } from "react";
import { createCodeHighlighter } from "../code/code-highlighter";
import type { MarkdownCodeLanguage } from "../code/code-languages";
import { createDiagramEnhancer } from "../diagrams/diagram-enhancer";
import type { MarkdownDiagramRenderer } from "../diagrams/diagram-types";
import { createFormulaEnhancer } from "../formulas/formula-enhancer";
import type { MarkdownFormulaRenderer } from "../formulas/formula-types";
import { mergeRenderTexts } from "../render/render-environment";
import type { MarkdownRenderOptions } from "../types";
import type { PreviewEnhancer } from "./preview-enhancer";

export interface DefaultEnhancerSettings {
  codeLanguages: readonly MarkdownCodeLanguage[];
  diagrams?: MarkdownDiagramRenderer;
  formulas?: MarkdownFormulaRenderer;
  renderOptions?: MarkdownRenderOptions;
}

const createOptionalEnhancers = ({ diagrams, formulas, renderOptions }: Omit<DefaultEnhancerSettings, "codeLanguages">): PreviewEnhancer[] => {
  const texts = mergeRenderTexts(renderOptions?.texts);
  return [
    ...(diagrams ? [createDiagramEnhancer({ renderer: diagrams, texts: texts.diagram })] : []),
    ...(formulas ? [createFormulaEnhancer({ renderer: formulas, texts: texts.formula })] : []),
  ];
};

export const useDefaultEnhancers = ({ codeLanguages, diagrams, formulas, renderOptions }: DefaultEnhancerSettings): readonly PreviewEnhancer[] => {
  const renderTexts = renderOptions?.texts;
  return useMemo(
    () => [createCodeHighlighter(codeLanguages), ...createOptionalEnhancers({ diagrams, formulas, renderOptions: { texts: renderTexts } })],
    [codeLanguages, diagrams, formulas, renderTexts],
  );
};
