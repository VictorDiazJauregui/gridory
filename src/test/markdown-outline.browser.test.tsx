import { render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

const paragraphs = (label: string) => Array.from({ length: 25 }, (_, index) => `${label} ${index + 1}.`).join("\n\n");
const DOCUMENT = `# Inicio\n\n${paragraphs("Uno")}\n\n## Medio\n\n${paragraphs("Dos")}\n\n## Final\n\n${paragraphs("Tres")}`;

const renderOutline = async () => {
  render(<MarkdownEditor defaultValue={DOCUMENT} defaultShowOutline syncScroll={false} />);
  await screen.findByRole("textbox", { name: "Texto en Markdown" });
  return screen.getByRole("navigation", { name: "Índice" });
};

const readOffsetInside = (container: Element, element: Element) => element.getBoundingClientRect().top - container.getBoundingClientRect().top;

const readCurrentHeading = (outline: HTMLElement) => outline.querySelector('[aria-current="location"]')?.textContent;

test("takes the source and the preview to the picked heading", async () => {
  const outline = await renderOutline();
  await userEvent.click(within(outline).getByRole("button", { name: "Medio" }));
  const preview = document.querySelector(".gdy-md-preview-panel") as HTMLElement;
  const sourceScroller = document.querySelector(".cm-scroller") as HTMLElement;
  await vi.waitFor(() => expect(Math.abs(readOffsetInside(preview, preview.querySelector("h2") as HTMLElement))).toBeLessThan(2));
  const headingLine = [...document.querySelectorAll(".cm-line")].find((line) => line.textContent === "## Medio") as HTMLElement;
  expect(Math.abs(readOffsetInside(sourceScroller, headingLine))).toBeLessThan(8);
  expect(within(outline).getByRole("button", { name: "Medio" })).toHaveFocus();
});

test("marks the heading at the top of the scrolled source", async () => {
  const outline = await renderOutline();
  expect(readCurrentHeading(outline)).toBe("Inicio");
  const sourceScroller = document.querySelector(".cm-scroller") as HTMLElement;
  sourceScroller.scrollTop = sourceScroller.scrollHeight;
  await vi.waitFor(() => expect(readCurrentHeading(outline)).toBe("Final"));
  sourceScroller.scrollTop = 0;
  await vi.waitFor(() => expect(readCurrentHeading(outline)).toBe("Inicio"));
});
