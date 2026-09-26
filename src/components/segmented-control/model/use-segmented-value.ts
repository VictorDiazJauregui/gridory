import { useState } from "react";
import type { SegmentedControlProps } from "../types";

type SegmentedValueInput = Pick<SegmentedControlProps, "value" | "defaultValue" | "onValueChange">;

export const useSegmentedValue = ({ value, defaultValue, onValueChange }: SegmentedValueInput) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;
  const selectValue = (nextValue: string) => {
    if (nextValue === currentValue) return;
    if (!isControlled) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };
  return { currentValue, selectValue };
};
