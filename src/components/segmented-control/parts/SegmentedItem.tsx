import { cn } from "../../../lib/cn";
import type { SegmentedControlView } from "../model/use-segmented-control";
import type { SegmentedOption } from "../types";
import { SegmentedItemContent } from "./SegmentedItemContent";

interface SegmentedItemProps {
  option: SegmentedOption;
  index: number;
  control: SegmentedControlView;
}

export const SegmentedItem = ({ option, index, control }: SegmentedItemProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={index === control.selectedIndex}
    tabIndex={index === control.tabStopIndex ? 0 : -1}
    className={cn("gdy-segmented-item", control.resolvedProps.classNames?.item)}
    onClick={() => control.selectValue(option.value)}
    onKeyDown={control.handleOptionKeyDown(index)}
  >
    <SegmentedItemContent
      option={option}
      iconPosition={control.resolvedProps.iconPosition}
      classNames={control.resolvedProps.classNames}
    />
  </button>
);
