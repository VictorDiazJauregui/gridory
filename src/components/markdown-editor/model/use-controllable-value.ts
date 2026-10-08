import { useCallback, useState } from "react";

interface ControllableValueOptions<Value> {
  value?: Value;
  defaultValue: Value;
  onChange?: (value: Value) => void;
}

export const useControllableValue = <Value>({ value, defaultValue, onChange }: ControllableValueOptions<Value>) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const changeValue = useCallback(
    (nextValue: Value) => {
      if (!isControlled) setUncontrolledValue(nextValue);
      onChange?.(nextValue);
    },
    [isControlled, onChange],
  );
  return [isControlled ? value : uncontrolledValue, changeValue] as const;
};
