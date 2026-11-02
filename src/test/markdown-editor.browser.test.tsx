import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import { LONG_DOCUMENT_SAMPLE } from "../components/mocks/markdown-editor/markdown-samples";
import { findRequiredElement } from "./browser/elements";

const ALIGNMENT_TOLERANCE_PX = 24;
const COARSE_SCROLL_STEP_PX = 120;
const FINE_SCROLL_STEP_PX = 4;
const FINE_SCROLL_ZONE_PX = 40;

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

const readImagesLoaded = (panel: HTMLElement): boolean =>
  [...panel.querySelectorAll("img")].every((image) => image.complete && image.naturalHeight > 0);

// The panel follows one frame after a scroll and again when an image or a diagram changes its height.
const waitForPanelToSettle = (panel: HTMLElement) =>
  expect
    .poll(async () => {
      const scrollTop = panel.scrollTop;
      await nextFrame();
      await nextFrame();
      return panel.scrollTop === scrollTop;
    })
    .toBe(true);

const renderLongDocument = async (syncScroll = true) => {
  const { container } = render(
    <div style={{ width: 1100 }}>
      <MarkdownEditor defaultValue={LONG_DOCUMENT_SAMPLE} syncScroll={syncScroll} />
    </div>,
  );
  await screen.findByRole("textbox", { name: "Texto en Markdown" });
  const panel = findRequiredElement(container, ".gdy-md-preview-panel") as HTMLElement;
  await expect.poll(() => readImagesLoaded(panel)).toBe(true);
  await expect.poll(() => container.querySelector(".gdy-md-source[aria-busy]")).toBeNull();
  return { source: findRequiredElement(container, ".cm-scroller") as HTMLElement, panel };
};

const findLineAtTop = (source: HTMLElement): Element | undefined =>
  [...source.querySelectorAll(".cm-line")].find((line) => line.getBoundingClientRect().bottom > source.getBoundingClientRect().top + 1);

const readDistanceToTop = (source: HTMLElement, lineText: string): number => {
  const line = [...source.querySelectorAll(".cm-line")].find((candidate) => candidate.textContent?.startsWith(lineText));
  return line ? line.getBoundingClientRect().top - source.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
};

// Long jumps reach the block quickly; the last pixels go 4 at a time, as a person scrolling would land on it.
const readNextScrollStep = (source: HTMLElement, lineText: string): number => {
  const distance = readDistanceToTop(source, lineText) - FINE_SCROLL_ZONE_PX;
  return distance > 0 ? Math.min(COARSE_SCROLL_STEP_PX, distance) : FINE_SCROLL_STEP_PX;
};

const scrollSourceUntil = async (source: HTMLElement, lineText: string) => {
  await userEvent.hover(source);
  while (!findLineAtTop(source)?.textContent?.startsWith(lineText) && source.scrollTop < source.scrollHeight) {
    source.scrollTop += readNextScrollStep(source, lineText);
    await nextFrame();
  }
};

// The panels connect in an effect after the editor loads and a scroll before that is lost, so the source nudges
// until the preview follows.
const waitForPreviewToFollow = async (source: HTMLElement, panel: HTMLElement) => {
  await userEvent.hover(source);
  await expect
    .poll(async () => {
      source.scrollTop += FINE_SCROLL_STEP_PX;
      await nextFrame();
      return panel.scrollTop;
    })
    .toBeGreaterThan(0);
};

test("brings the same block to the top of the preview after a tall image", async () => {
  const { source, panel } = await renderLongDocument();
  await scrollSourceUntil(source, "## Un bloque de código largo");
  await waitForPanelToSettle(panel);
  const heading = screen.getByRole("heading", { name: "Un bloque de código largo" });
  const offset = heading.getBoundingClientRect().top - panel.getBoundingClientRect().top;
  expect(Math.abs(offset)).toBeLessThan(ALIGNMENT_TOLERANCE_PX);
});

test("leaves the preview still when synced scrolling is off", async () => {
  const { source, panel } = await renderLongDocument(false);
  await userEvent.hover(source);
  source.scrollTop = 900;
  await nextFrame();
  await nextFrame();
  expect(panel.scrollTop).toBe(0);
});

test("scrolls the source to the end when the preview reaches it", async () => {
  const { source, panel } = await renderLongDocument();
  await waitForPreviewToFollow(source, panel);
  await userEvent.hover(panel);
  panel.scrollTop = panel.scrollHeight;
  await vi.waitFor(() => expect(source.scrollHeight - source.scrollTop - source.clientHeight).toBeLessThan(ALIGNMENT_TOLERANCE_PX));
});
