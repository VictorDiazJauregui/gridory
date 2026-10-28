import type { ReactNode } from "react";

/** Whether an own render function returned something to show: `null`, `undefined` and booleans are not. */
export const isRenderable = (content: ReactNode) =>
  content !== null && content !== undefined && typeof content !== "boolean";
