import {
  SegmentedControlItem,
  type SegmentedControlDisplay,
  type SegmentedControlOption,
} from "./segmented-control-item";
import { ToggleGroup } from "./toggle-group-primitives";

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  display?: SegmentedControlDisplay;
  ariaLabel?: string;
  className?: string;
}

const SegmentedControl = (props: SegmentedControlProps) => {
  const { options, value, onChange, display = "both" } = props;
  return (
    <ToggleGroup
      type="single"
      value={value}
      aria-label={props.ariaLabel}
      onValueChange={(next) => next && onChange(next)}
      className={props.className}
    >
      {options.map((option) => (
        <SegmentedControlItem
          key={option.value}
          option={option}
          display={display}
        />
      ))}
    </ToggleGroup>
  );
}

export { SegmentedControl };
