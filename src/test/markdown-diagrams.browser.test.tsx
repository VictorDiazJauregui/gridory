import { render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { mermaidDiagrams } from "../components/markdown-editor/diagrams/mermaid-diagrams";
import { MarkdownViewer } from "../components/markdown-editor/viewer/MarkdownViewer";
import { applyTheme, type Theme } from "./browser/environment";
import { readColorContrast } from "./browser/contrast";

const FLOWCHART = "```mermaid\nflowchart LR\n  Pedido --> Pago --> Envío\n```";
const GANTT = "```mermaid\ngantt\n  dateFormat YYYY-MM-DD\n  section Equipo\n    Diseño :a1, 2026-10-01, 5d\n    Código :after a1, 8d\n```";
const GANTT_WITH_EVERY_TASK_STATE = [
  "```mermaid",
  "gantt",
  "  dateFormat YYYY-MM-DD",
  "  section Producto",
  "    Congelar funcionalidades :done, p1, 2026-10-20, 12d",
  "    Regresión :active, q1, after p1, 5d",
  "    Publicación :d1, after q1, 7d",
  "```",
].join("\n");

const renderDiagrams = async (theme: Theme) => {
  applyTheme(theme);
  render(<MarkdownViewer value={`${FLOWCHART}\n\n${GANTT}`} aria-label="Nota" diagrams={mermaidDiagrams} />);
  const region = screen.getByRole("region", { name: "Nota" });
  await vi.waitFor(() => expect(region.querySelectorAll('[data-diagram-state="ready"]')).toHaveLength(2), { timeout: 15000 });
  return [...region.querySelectorAll<HTMLElement>(".gdy-md-diagram")];
};

const readNodeFill = (figure: HTMLElement) => getComputedStyle(figure.querySelector(".node rect, .node polygon, .label-container") as Element).fill;

test.each(["light", "dark"] as const)("draws a flowchart and a Gantt chart that fit the panel in %s", async (theme) => {
  const [flowchart, gantt] = await renderDiagrams(theme);
  ["Pedido", "Pago", "Envío"].forEach((label) => expect(flowchart.querySelector("svg")).toHaveTextContent(label));
  expect(gantt.querySelectorAll("rect.task").length).toBe(2);
  [flowchart, gantt].forEach((figure) => expect(figure.querySelector("svg")!.getBoundingClientRect().width).toBeLessThanOrEqual(figure.clientWidth));
});

test("paints the nodes with the colors of the active theme", async () => {
  const [lightFlowchart] = await renderDiagrams("light");
  const lightFill = readNodeFill(lightFlowchart);
  applyTheme("dark");
  await vi.waitFor(() => expect(readNodeFill(screen.getByRole("region", { name: "Nota" }).querySelector(".gdy-md-diagram") as HTMLElement)).not.toBe(lightFill), { timeout: 15000 });
});

test("opens the diagram at full size in a modal that Escape closes", async () => {
  const [flowchart] = await renderDiagrams("light");
  await userEvent.click(within(flowchart).getByRole("button", { name: "Ver a tamaño completo" }));
  const dialog = screen.getByRole("dialog", { name: "Diagrama" });
  const box = dialog.getBoundingClientRect();
  expect(Math.abs(box.top + box.height / 2 - window.innerHeight / 2)).toBeLessThan(2);
  expect(dialog.querySelector("svg")).not.toBeNull();
  expect(within(dialog).getByRole("button", { name: "Cerrar" })).toHaveFocus();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
});

const renderGanttWithEveryTaskState = async (theme: Theme) => {
  applyTheme(theme);
  render(<MarkdownViewer value={GANTT_WITH_EVERY_TASK_STATE} aria-label="Plan" diagrams={mermaidDiagrams} />);
  const region = screen.getByRole("region", { name: "Plan" });
  await vi.waitFor(() => expect(region.querySelector('[data-diagram-state="ready"]')).not.toBeNull(), { timeout: 15000 });
  return region.querySelector("svg") as SVGSVGElement;
};

const readTaskTextContrasts = (chart: SVGSVGElement): number[] =>
  [...chart.querySelectorAll<SVGRectElement>("rect.task")].map((bar) => {
    const label = chart.querySelector(`[id="${bar.id}-text"]`) as SVGTextElement;
    return readColorContrast(getComputedStyle(label).fill, getComputedStyle(bar).fill);
  });

const findOverlappingTicks = (chart: SVGSVGElement): string[] => {
  const ticks = [...chart.querySelectorAll(".tick text")].map((tick) => ({ label: tick.textContent ?? "", box: tick.getBoundingClientRect() }));
  return ticks.slice(1).filter((tick, index) => tick.box.left < ticks[index].box.right).map((tick) => tick.label);
};

test.each(["light", "dark"] as const)("keeps every Gantt task label readable on its bar in %s", async (theme) => {
  const chart = await renderGanttWithEveryTaskState(theme);
  const contrasts = readTaskTextContrasts(chart);
  expect(contrasts).toHaveLength(3);
  contrasts.forEach((contrast) => expect(contrast).toBeGreaterThanOrEqual(4.5));
});

test("labels the Gantt axis with dates that do not overlap across a month change", async () => {
  const chart = await renderGanttWithEveryTaskState("light");
  expect(chart.querySelector(".tick text")?.textContent).toMatch(/^\d{2}\/\d{2}$/);
  expect(findOverlappingTicks(chart)).toEqual([]);
});
