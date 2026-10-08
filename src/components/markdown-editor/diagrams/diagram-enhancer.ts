import { PREVIEW_CONTENT_CHANGE_EVENT, type PreviewEnhancer } from "../preview/preview-enhancer";
import type { MarkdownDiagramTexts } from "../types";
import { DIAGRAM_BLOCK_SELECTOR, showDiagramOutcome, wrapDiagramSource } from "./diagram-blocks";
import { cacheDiagram, readCachedDiagram, type DiagramOutcome } from "./diagram-cache";
import { readDiagramTheme, type DiagramTheme } from "./diagram-theme";
import type { MarkdownDiagramRenderer } from "./diagram-types";
import { renderDiagram } from "./mermaid-session";

const TYPING_PAUSE_MS = 300;

interface DiagramJob {
  figure: HTMLElement;
  source: string;
  theme: DiagramTheme;
}

interface DiagramSettings {
  renderer: MarkdownDiagramRenderer;
  texts: MarkdownDiagramTexts;
}

const describeLoadError = (error: unknown): DiagramOutcome => ({ error: error instanceof Error ? error.message : String(error) });

const readDiagramSource = (figure: HTMLElement): string => figure.querySelector(".gdy-md-diagram-source")?.textContent ?? "";

const collectFigures = (previewRoot: HTMLElement, texts: MarkdownDiagramTexts): HTMLElement[] => {
  previewRoot.querySelectorAll<HTMLElement>(DIAGRAM_BLOCK_SELECTOR).forEach((source) => wrapDiagramSource(source, texts));
  return [...previewRoot.querySelectorAll<HTMLElement>(".gdy-md-diagram")];
};

const showOutcome = (job: DiagramJob, outcome: DiagramOutcome, settings: DiagramSettings): void => {
  if (!job.figure.isConnected) return;
  showDiagramOutcome(job.figure, outcome, settings.texts);
  job.figure.dataset.themeKey = job.theme.key;
};

const drawJob = async (job: DiagramJob, settings: DiagramSettings): Promise<void> => {
  const rememberOutcome = (outcome: DiagramOutcome) => {
    cacheDiagram(job.theme.key, job.source, outcome);
    return outcome;
  };
  const outcome = await renderDiagram(settings.renderer, job.source, job.theme).then(rememberOutcome, describeLoadError);
  showOutcome(job, outcome, settings);
  job.figure.dispatchEvent(new CustomEvent(PREVIEW_CONTENT_CHANGE_EVENT, { bubbles: true }));
};

const scheduledDrawings = new WeakMap<HTMLElement, number>();

const scheduleDrawings = (previewRoot: HTMLElement, jobs: DiagramJob[], draw: (job: DiagramJob) => void): void => {
  window.clearTimeout(scheduledDrawings.get(previewRoot));
  if (jobs.length === 0) return;
  scheduledDrawings.set(previewRoot, window.setTimeout(() => jobs.forEach(draw), TYPING_PAUSE_MS));
};

const showCachedOutcome = (job: DiagramJob, settings: DiagramSettings): boolean => {
  const cached = readCachedDiagram(job.theme.key, job.source);
  if (cached) showOutcome(job, cached, settings);
  return Boolean(cached);
};

export const createDiagramEnhancer =
  (settings: DiagramSettings): PreviewEnhancer =>
  (previewRoot) => {
    const figures = collectFigures(previewRoot, settings.texts);
    if (figures.length === 0) return;
    const theme = readDiagramTheme(previewRoot);
    const pending = figures
      .filter((figure) => figure.dataset.themeKey !== theme.key)
      .map((figure) => ({ figure, source: readDiagramSource(figure), theme }))
      .filter((job) => !showCachedOutcome(job, settings));
    scheduleDrawings(previewRoot, pending, (job) => void drawJob(job, settings));
  };
