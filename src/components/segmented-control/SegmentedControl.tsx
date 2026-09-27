import { cn } from "../../lib/cn";
import { buildIndicatorStyle } from "./model/indicator-box";
import { buildRootAttributes } from "./model/root-attributes";
import { useIndicatorBox } from "./model/use-indicator-box";
import { useSegmentedControl } from "./model/use-segmented-control";
import { SegmentedIndicator } from "./parts/SegmentedIndicator";
import { SegmentedItem } from "./parts/SegmentedItem";
import type { SegmentedControlProps } from "./types";
import "./styles.css";

export const SegmentedControl = (props: SegmentedControlProps) => {
  const control = useSegmentedControl(props);
  const { rootRef, indicatorBox } = useIndicatorBox(control.selectedIndex, props.options);
  const { resolvedProps } = control;
  return (
    <div
      ref={rootRef}
      {...buildRootAttributes(resolvedProps)}
      className={cn("gdy-scope gdy-segmented", resolvedProps.className, resolvedProps.classNames?.root)}
      style={buildIndicatorStyle(indicatorBox)}
    >
      {indicatorBox ? <SegmentedIndicator className={resolvedProps.classNames?.indicator} /> : null}
      {resolvedProps.options.map((option, index) => (
        <SegmentedItem key={option.value} option={option} index={index} control={control} />
      ))}
    </div>
  );
};
