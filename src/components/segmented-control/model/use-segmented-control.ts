import { applyPropDefaults } from "../../shared/prop-defaults";
import { SEGMENTED_CONTROL_DEFAULTS } from "../constants";
import type { SegmentedControlProps } from "../types";
import { createOptionKeyDownHandler, resolveTabStopIndex } from "./roving-focus";
import { useSegmentedValue } from "./use-segmented-value";

export const useSegmentedControl = (props: SegmentedControlProps) => {
  const resolvedProps = applyPropDefaults(SEGMENTED_CONTROL_DEFAULTS, props);
  const { currentValue, selectValue } = useSegmentedValue(props);
  const selectedIndex = props.options.findIndex((option) => option.value === currentValue);
  return {
    resolvedProps,
    selectedIndex,
    tabStopIndex: resolveTabStopIndex(selectedIndex),
    selectValue,
    handleOptionKeyDown: createOptionKeyDownHandler(props.options, selectValue),
  };
};

export type SegmentedControlView = ReturnType<typeof useSegmentedControl>;
