import "@testing-library/jest-dom/vitest";
import { cleanup, waitFor } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// jsdom implements neither pointer capture, scrollIntoView nor ResizeObserver;
// Radix Select and the chat transcript call them on every open or new message.
const elementPrototype = window.HTMLElement.prototype;
elementPrototype.scrollIntoView ??= () => {};
elementPrototype.hasPointerCapture ??= () => false;
elementPrototype.setPointerCapture ??= () => {};
elementPrototype.releasePointerCapture ??= () => {};
window.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// The Markdown editor loads CodeMirror lazily; a load still pending when the file ends fails the run.
const waitForMarkdownEditorsToLoad = () =>
  waitFor(() => expect(document.querySelector('.gdy-md-source[aria-busy="true"]')).toBeNull(), {
    timeout: 10_000,
  });

afterEach(async () => {
  await waitForMarkdownEditorsToLoad();
  cleanup();
});
