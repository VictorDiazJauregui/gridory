import type { ReactNode } from "react";

export const isRenderable = (content: ReactNode) =>
  content !== null && content !== undefined && typeof content !== "boolean";
