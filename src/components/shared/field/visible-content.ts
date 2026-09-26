import type { ReactNode } from "react";

export const hasVisibleContent = (content: ReactNode): boolean => {
  if (content === null || content === undefined || typeof content === "boolean") return false;
  if (typeof content === "string") return content.trim() !== "";
  return true;
};
