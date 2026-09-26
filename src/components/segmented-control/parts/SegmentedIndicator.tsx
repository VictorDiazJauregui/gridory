import { cn } from "../../../lib/cn";

interface SegmentedIndicatorProps {
  className?: string;
}

/** The chosen option's background, drawn once and slid under the options. */
export const SegmentedIndicator = ({ className }: SegmentedIndicatorProps) => (
  <span className={cn("gdy-segmented-indicator", className)} aria-hidden="true" />
);
