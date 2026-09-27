import type { ComponentProps } from "react";

import type { PopoverContent } from "../../ui/popover";

type FloatingPanelPlacement = Pick<
  ComponentProps<typeof PopoverContent>,
  "side" | "align" | "sideOffset" | "avoidCollisions" | "collisionPadding"
>;

export const FLOATING_PANEL_PLACEMENT = {
  side: "bottom",
  align: "start",
  sideOffset: 4,
  avoidCollisions: true,
  collisionPadding: 8,
} as const satisfies FloatingPanelPlacement;
