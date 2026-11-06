import type { CSSProperties } from "react";

const SIDE_OFFSET = 6;
const COLLISION_PADDING = 8;

// Above the trigger and centered on it, kept inside the viewport; below it when there is no room above.
export const placeHelpTooltip = (trigger: DOMRect, tooltip: DOMRect): { style: CSSProperties; side: "top" | "bottom" } => {
  const fitsAbove = trigger.top - tooltip.height - SIDE_OFFSET >= COLLISION_PADDING;
  const top = fitsAbove ? trigger.top - tooltip.height - SIDE_OFFSET : trigger.bottom + SIDE_OFFSET;
  const centeredLeft = trigger.left + trigger.width / 2 - tooltip.width / 2;
  const maxLeft = window.innerWidth - tooltip.width - COLLISION_PADDING;
  const left = Math.max(COLLISION_PADDING, Math.min(centeredLeft, maxLeft));
  return { style: { position: "fixed", top, left }, side: fitsAbove ? "top" : "bottom" };
};
