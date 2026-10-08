import DOMPurify from "dompurify";
import type { KatexRenderer, MarkdownFormulaRenderer } from "./formula-types";

export type FormulaOutcome = { html: string } | { error: string };

const loadedRenderers = new WeakMap<MarkdownFormulaRenderer, KatexRenderer>();
const pendingLoads = new WeakMap<MarkdownFormulaRenderer, Promise<KatexRenderer>>();
const cachedOutcomes = new Map<string, FormulaOutcome>();
const MAX_CACHED_FORMULAS = 300;
const MATH_PROFILE = { USE_PROFILES: { html: true, mathMl: true, svg: true } };

export const readLoadedKatex = (renderer: MarkdownFormulaRenderer): KatexRenderer | undefined => loadedRenderers.get(renderer);

export const loadKatex = (renderer: MarkdownFormulaRenderer): Promise<KatexRenderer> => {
  const pending = pendingLoads.get(renderer) ?? renderer.load().then((module) => module.default);
  pendingLoads.set(renderer, pending);
  return pending.then(
    (katex) => {
      loadedRenderers.set(renderer, katex);
      return katex;
    },
    (error: unknown) => {
      pendingLoads.delete(renderer);
      throw error;
    },
  );
};

const describeError = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const renderNow = (katex: KatexRenderer, tex: string, displayMode: boolean): FormulaOutcome => {
  try {
    const html = katex.renderToString(tex, { displayMode, throwOnError: true, output: "htmlAndMathml", trust: false });
    return { html: DOMPurify.sanitize(html, MATH_PROFILE) };
  } catch (error) {
    return { error: describeError(error) };
  }
};

export const renderFormula = (katex: KatexRenderer, tex: string, displayMode: boolean): FormulaOutcome => {
  const key = `${displayMode ? "display" : "inline"}\n${tex}`;
  const outcome = cachedOutcomes.get(key) ?? renderNow(katex, tex, displayMode);
  cachedOutcomes.set(key, outcome);
  const oldestKey = cachedOutcomes.keys().next().value;
  if (cachedOutcomes.size > MAX_CACHED_FORMULAS && oldestKey !== undefined) cachedOutcomes.delete(oldestKey);
  return outcome;
};
