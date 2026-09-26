import type { SegmentedControlProps } from "./types";

/** Step each arrow key takes through the options, as in a native radio group. */
export const ARROW_KEY_STEPS: Readonly<Record<string, number>> = {
  ArrowLeft: -1,
  ArrowUp: -1,
  ArrowRight: 1,
  ArrowDown: 1,
};

export const SEGMENTED_CONTROL_DEFAULTS: Required<Pick<SegmentedControlProps, "iconPosition" | "animated">> = {
  iconPosition: "start",
  animated: true,
};
