import * as React from "react";

import { ToggleGroupItem } from "./toggle-group-primitives";

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export type SegmentedControlDisplay = "label" | "icon" | "both";

interface SegmentedControlItemProps {
  option: SegmentedControlOption;
  display: SegmentedControlDisplay;
}

const resolveDisplay = (
  option: SegmentedControlOption,
  display: SegmentedControlDisplay,
) => {
  const showIcon = Boolean(option.icon) && display !== "label";
  const showLabel = display !== "icon" || !option.icon;
  return { showIcon, showLabel };
}

const SegmentedControlItem = ({
  option,
  display,
}: SegmentedControlItemProps) => {
  const { showIcon, showLabel } = resolveDisplay(option, display);
  return (
    <ToggleGroupItem
      value={option.value}
      aria-label={option.label}
      title={option.label}
    >
      {showIcon ? option.icon : null}
      {showLabel ? (
        <span className="gdy-toggle-item-label">{option.label}</span>
      ) : null}
    </ToggleGroupItem>
  );
}

export { SegmentedControlItem };
