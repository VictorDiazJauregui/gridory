import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import { LONG_DOCUMENT_SAMPLE } from "../components/mocks/markdown-editor/markdown-samples";
import { findRequiredElement } from "./browser/elements";

const ALIGNMENT_TOLERANCE_PX = 24;

const nextFrames = () => new Promise((resolve) => setTimeout(resolve, 200));

const renderLongDocument = async (syncScroll = true) => {
  const { container } = render(
    <div style={{ width: 1100 }}>
      <MarkdownEditor defaultValue={LONG_DOCUMENT_SAMPLE} syncScroll={syncScroll} />
    </div>,
  );
  await screen.findByRole("textbox", { name: "Texto en Markdown" });
  await nextFrames();
  return {
    source: findRequiredElement(container, ".cm-scroller") as HTMLElement,
    panel: findRequiredElement(container, ".gdy-md-preview-panel") as HTMLElement,
  };
};

const findLineAtTop = (source: HTMLElement): Element | undefined =>
  [...source.querySelectorAll(".cm-line")].find((line) => line.getBoundingClientRect().bottom > source.getBoundingClientRect().top + 1);

const scrollSourceUntil = async (source: HTMLElement, lineText: string) => {
  source.dispatchEvent(new PointerEvent("pointerenter"));
  while (!findLineAtTop(source)?.textContent?.startsWith(lineText) && source.scrollTop < source.scrollHeight) {
    source.scrollTop += 4;
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  await nextFrames();
};

test("brings the same block to the top of the preview after a tall image", async () => {
  const { source, panel } = await renderLongDocument();
  await scrollSourceUntil(source, "## Un bloque de código largo");
  const heading = screen.getByRole("heading", { name: "Un bloque de código largo" });
  const offset = heading.getBoundingClientRect().top - panel.getBoundingClientRect().top;
  expect(Math.abs(offset)).toBeLessThan(ALIGNMENT_TOLERANCE_PX);
});

test("leaves the preview still when synced scrolling is off", async () => {
  const { source, panel } = await renderLongDocument(false);
  source.dispatchEvent(new PointerEvent("pointerenter"));
  source.scrollTop = 900;
  await nextFrames();
  expect(panel.scrollTop).toBe(0);
});

test("scrolls the source to the end when the preview reaches it", async () => {
  const { source, panel } = await renderLongDocument();
  panel.dispatchEvent(new PointerEvent("pointerenter"));
  panel.scrollTop = panel.scrollHeight;
  await vi.waitFor(() => expect(source.scrollHeight - source.scrollTop - source.clientHeight).toBeLessThan(ALIGNMENT_TOLERANCE_PX));
});
