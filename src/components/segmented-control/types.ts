import type { ReactNode } from "react";
import type { AccessibleName } from "../shared/accessible-name";

/** Side of the label the option icon sits on. */
export type SegmentedIconPosition = "start" | "end";

export interface SegmentedOption {
  value: string;
  label: string;
  /** Decorative: the option is named by its label. */
  icon?: ReactNode;
}

/** One class per part, added next to the `gdy-segmented-*` hooks. */
export interface SegmentedControlClassNames {
  root?: string;
  indicator?: string;
  item?: string;
  icon?: string;
  label?: string;
}

interface SegmentedControlBaseProps {
  options: SegmentedOption[];
  /** Controlled value. Leave it out and use `defaultValue` for an uncontrolled control. */
  value?: string;
  defaultValue?: string;
  /** Fires only when the chosen option changes, by click or by keyboard. */
  onValueChange?: (value: string) => void;
  iconPosition?: SegmentedIconPosition;
  /** Slides the indicator between options. `prefers-reduced-motion` switches it off too. */
  animated?: boolean;
  className?: string;
  classNames?: SegmentedControlClassNames;
}

/** A radio group needs a name: pass `aria-label` or `aria-labelledby`. */
export type SegmentedControlProps = SegmentedControlBaseProps & AccessibleName;
