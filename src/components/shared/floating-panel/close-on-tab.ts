import type { KeyboardEvent } from "react";

// Radix loops Tab inside a non-modal panel and the portal sits at the end of
// the body, so Tab would never leave it: closing instead makes Radix hand the
// focus back to the trigger, and the next Tab continues from the field.
export const closeOnTab = (event: KeyboardEvent<HTMLElement>, closePanel: () => void): void => {
  if (event.key !== "Tab") return;
  event.preventDefault();
  closePanel();
};
