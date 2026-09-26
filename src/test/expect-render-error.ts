import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { expect, vi } from "vitest";

type ErrorClass = new (...args: never[]) => Error;

// React 18 re-dispatches a render error to window and logs it; both are
// expected here, so they are kept out of the test output and always restored.
export const expectRenderError = (element: ReactElement, errorClass: ErrorClass): void => {
  const muteReport = (event: ErrorEvent) => event.preventDefault();
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
  window.addEventListener("error", muteReport);
  try {
    expect(() => render(element)).toThrow(errorClass);
  } finally {
    window.removeEventListener("error", muteReport);
    consoleError.mockRestore();
  }
};
