import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

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

afterEach(cleanup);
