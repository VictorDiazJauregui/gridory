import { render, screen } from "@testing-library/react";
import type { CSSProperties } from "react";
import { expect, test, vi } from "vitest";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import { MarkdownViewer } from "../components/markdown-editor/viewer/MarkdownViewer";
import { readContrastRatio } from "./browser/contrast";
import { applyScreen, applyTheme, type ScreenName } from "./browser/environment";

const AA_NORMAL_TEXT = 4.5;
const APP_SURFACE: CSSProperties = { background: "var(--gdy-background)" };
const ALERTS = ["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"].map((kind) => `> [!${kind}]\n> Texto del aviso.`).join("\n\n");
const CODE = "```ts\nconst total: number = 42;\nfunction sum() { return \"listo\"; }\n```";

test.each(["light", "dark"] as const)("keeps alert titles and code colors at AA contrast in %s", async (theme) => {
  applyTheme(theme);
  render(<div style={APP_SURFACE}><MarkdownViewer value={`${ALERTS}\n\n${CODE}`} aria-label="Nota" /></div>);
  const region = screen.getByRole("region", { name: "Nota" });
  await vi.waitFor(() => expect(region.querySelector("code[data-highlighted]")).not.toBeNull());
  const samples = [...region.querySelectorAll(".gdy-md-alert-title, .gdy-md-alert > p:not(.gdy-md-alert-title), [class^='hljs-']")];
  expect(samples.length).toBeGreaterThan(8);
  samples.forEach((sample) => expect.soft(readContrastRatio(sample), `${sample.className}: ${sample.textContent}`).toBeGreaterThanOrEqual(AA_NORMAL_TEXT));
});

test("follows the theme and the component tokens", async () => {
  const tokens = { "--gdy-md-editor-background": "rgb(255, 250, 242)", "--gdy-md-divider": "rgb(201, 166, 107)", "--gdy-md-preview-font-family": "serif" } as CSSProperties;
  render(<div style={tokens}><MarkdownEditor defaultValue="# Hola" /></div>);
  await screen.findByRole("textbox", { name: "Texto en Markdown" });
  const previewPanel = document.querySelector(".gdy-md-preview-panel") as HTMLElement;
  expect(getComputedStyle(previewPanel).borderLeftColor).toBe("rgb(201, 166, 107)");
  expect(getComputedStyle(document.querySelector(".cm-editor") as Element).backgroundColor).toBe("rgb(255, 250, 242)");
  expect(getComputedStyle(screen.getByRole("region", { name: "Vista previa" })).fontFamily).toBe("serif");
  const lightText = getComputedStyle(screen.getByRole("region", { name: "Vista previa" })).color;
  applyTheme("dark");
  expect(getComputedStyle(screen.getByRole("region", { name: "Vista previa" })).color).not.toBe(lightText);
});

test.each<ScreenName>(["iphone14Pro", "pixel7"])("shows the split view as Editor and Vista previa tabs on %s, without page scroll", async (screenName) => {
  await applyScreen(screenName);
  const onViewChange = vi.fn();
  render(<MarkdownEditor defaultValue={"# Hola\n\n| a | b | c | d | e | f |\n| - | - | - | - | - | - |\n| 1 | 2 | 3 | 4 | 5 | 6 |"} onViewChange={onViewChange} />);
  await screen.findByRole("textbox", { name: "Texto en Markdown" });
  const panels = document.querySelector(".gdy-md-panels") as HTMLElement;
  await vi.waitFor(() => expect(panels).toHaveAttribute("data-view", "source"));
  const views = screen.getByRole("group", { name: "Vista" });
  expect([...views.querySelectorAll("button")].map((button) => button.getAttribute("aria-label"))).toEqual(["Editor", "Vista previa"]);
  screen.getByRole("button", { name: "Vista previa" }).click();
  await vi.waitFor(() => expect(panels).toHaveAttribute("data-view", "preview"));
  expect(onViewChange).not.toHaveBeenCalled();
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  expect(screen.getByRole("button", { name: "Más herramientas" })).toBeInTheDocument();
});

test("paints the important alert apart from the note", async () => {
  render(<MarkdownViewer value={"> [!NOTE]\n> Nota.\n\n> [!IMPORTANT]\n> Importante."} aria-label="Avisos" />);
  const [note, important] = [...screen.getByRole("region", { name: "Avisos" }).querySelectorAll(".gdy-md-alert")];
  expect(getComputedStyle(important).borderLeftColor).not.toBe(getComputedStyle(note).borderLeftColor);
});
