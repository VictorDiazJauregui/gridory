import { cn } from "../../../lib/cn";
import type { SegmentedControlClassNames, SegmentedIconPosition, SegmentedOption } from "../types";

interface SegmentedItemContentProps {
  option: SegmentedOption;
  iconPosition: SegmentedIconPosition;
  classNames?: SegmentedControlClassNames;
}

export const SegmentedItemContent = ({ option, iconPosition, classNames }: SegmentedItemContentProps) => {
  const icon = option.icon ? (
    <span className={cn("gdy-segmented-icon", classNames?.icon)} aria-hidden="true">
      {option.icon}
    </span>
  ) : null;
  const label = <span className={cn("gdy-segmented-label", classNames?.label)}>{option.label}</span>;
  if (iconPosition === "end") return <>{label}{icon}</>;
  return <>{icon}{label}</>;
};
