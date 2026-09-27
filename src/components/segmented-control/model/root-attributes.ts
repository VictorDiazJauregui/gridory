import type { SegmentedControlView } from "./use-segmented-control";

type ResolvedSegmentedProps = SegmentedControlView["resolvedProps"];

export const buildRootAttributes = (resolvedProps: ResolvedSegmentedProps) =>
  ({
    role: "radiogroup",
    "aria-label": resolvedProps["aria-label"],
    "aria-labelledby": resolvedProps["aria-labelledby"],
    "data-animated": resolvedProps.animated ? "true" : "false",
  }) as const;
