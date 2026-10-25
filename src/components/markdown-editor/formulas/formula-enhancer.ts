import { PREVIEW_CONTENT_CHANGE_EVENT, type PreviewEnhancer } from "../preview/preview-enhancer";
import type { MarkdownFormulaTexts } from "../types";
import { loadKatex, readLoadedKatex, renderFormula, type FormulaOutcome } from "./formula-session";
import type { KatexRenderer, MarkdownFormulaRenderer } from "./formula-types";

const PENDING_FORMULA_SELECTOR = ".gdy-md-math:not([data-math-state])";

interface FormulaSettings {
  renderer: MarkdownFormulaRenderer;
  texts: MarkdownFormulaTexts;
}

const createTextElement = (className: string, text: string): HTMLSpanElement => {
  const element = document.createElement("span");
  element.className = className;
  element.textContent = text;
  return element;
};

const showError = (formula: HTMLElement, message: string): void => {
  const source = createTextElement("gdy-md-math-source", formula.textContent ?? "");
  const detail = formula.dataset.math === "display" ? [createTextElement("gdy-md-math-error", message)] : [];
  formula.replaceChildren(source, ...detail);
  formula.title = message;
  formula.setAttribute("data-math-state", "error");
};

const showOutcome = (formula: HTMLElement, outcome: FormulaOutcome, texts: MarkdownFormulaTexts): void => {
  if ("html" in outcome) {
    formula.innerHTML = outcome.html;
    formula.setAttribute("data-math-state", "ready");
    return;
  }
  showError(formula, `${texts.error}: ${outcome.error}`);
};

const drawFormulas = (formulas: HTMLElement[], katex: KatexRenderer, texts: MarkdownFormulaTexts): void =>
  formulas.forEach((formula) => showOutcome(formula, renderFormula(katex, formula.textContent ?? "", formula.dataset.math === "display"), texts));

const drawAfterLoading = (previewRoot: HTMLElement, formulas: HTMLElement[], settings: FormulaSettings): void => {
  formulas.forEach((formula) => formula.setAttribute("data-math-state", "loading"));
  const showLoadError = (error: unknown) => formulas.forEach((formula) => showOutcome(formula, { error: error instanceof Error ? error.message : String(error) }, settings.texts));
  void loadKatex(settings.renderer).then((katex) => {
    drawFormulas(formulas.filter((formula) => formula.isConnected), katex, settings.texts);
    previewRoot.dispatchEvent(new CustomEvent(PREVIEW_CONTENT_CHANGE_EVENT, { bubbles: true }));
  }, showLoadError);
};

export const createFormulaEnhancer =
  (settings: FormulaSettings): PreviewEnhancer =>
  (previewRoot) => {
    const formulas = [...previewRoot.querySelectorAll<HTMLElement>(PENDING_FORMULA_SELECTOR)];
    if (formulas.length === 0) return;
    const katex = readLoadedKatex(settings.renderer);
    if (katex) return drawFormulas(formulas, katex, settings.texts);
    drawAfterLoading(previewRoot, formulas, settings);
  };
