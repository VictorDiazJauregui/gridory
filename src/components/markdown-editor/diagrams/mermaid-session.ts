import type { MarkdownDiagramRenderer, MermaidRenderer } from "./diagram-types";
import type { DiagramOutcome } from "./diagram-cache";
import type { DiagramTheme } from "./diagram-theme";
import { sanitizeDiagramSvg } from "./sanitize-diagram-svg";

const GANTT_AXIS_FORMAT = "%d/%m";
const loadedRenderers = new WeakMap<MarkdownDiagramRenderer, Promise<MermaidRenderer>>();
let renderQueue: Promise<unknown> = Promise.resolve();
let initializedThemeKey = "";
let diagramCount = 0;

const forgetFailedLoad = (renderer: MarkdownDiagramRenderer) => (error: unknown): never => {
  loadedRenderers.delete(renderer);
  throw error;
};

const loadRenderer = (renderer: MarkdownDiagramRenderer): Promise<MermaidRenderer> => {
  const loaded = loadedRenderers.get(renderer) ?? renderer.load().then((module) => module.default, forgetFailedLoad(renderer));
  loadedRenderers.set(renderer, loaded);
  return loaded;
};

const initializeTheme = (mermaid: MermaidRenderer, theme: DiagramTheme): void => {
  if (initializedThemeKey === theme.key) return;
  mermaid.initialize({ startOnLoad: false, securityLevel: "strict", htmlLabels: false, suppressErrorRendering: true, theme: "base", themeVariables: theme.variables, gantt: { useWidth: theme.width, axisFormat: GANTT_AXIS_FORMAT } });
  initializedThemeKey = theme.key;
};

const describeError = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const renderNow = async (mermaid: MermaidRenderer, source: string, theme: DiagramTheme): Promise<DiagramOutcome> => {
  initializeTheme(mermaid, theme);
  diagramCount += 1;
  const id = `gdy-md-diagram-${diagramCount}`;
  try {
    const { svg } = await mermaid.render(id, source);
    return { svg: sanitizeDiagramSvg(svg) };
  } catch (error) {
    document.getElementById(id)?.remove();
    return { error: describeError(error) };
  }
};

export const renderDiagram = async (renderer: MarkdownDiagramRenderer, source: string, theme: DiagramTheme): Promise<DiagramOutcome> => {
  const mermaid = await loadRenderer(renderer);
  const outcome = renderQueue.then(() => renderNow(mermaid, source, theme));
  renderQueue = outcome;
  return outcome;
};
