import { useEffect, useRef, useState } from "react";
import { useLatestRef } from "../use-latest-ref";
import { isDevelopmentBuild } from "./development-build";

export type StateUpdate<TValue> = TValue | ((previous: TValue) => TValue);

export interface ControllableStateConfig<TValue> {
  /** Controlled value; `undefined` leaves the state to the component. */
  value?: TValue;
  defaultValue: TValue;
  onChange?: (value: TValue) => void;
  /** Prop name used in the development warning. */
  name: string;
}

const resolveUpdate = <TValue>(update: StateUpdate<TValue>, previous: TValue): TValue =>
  typeof update === "function" ? (update as (previous: TValue) => TValue)(previous) : update;

const useModeChangeWarning = (isControlled: boolean, name: string) => {
  const initialMode = useRef(isControlled);
  const warned = useRef(false);
  useEffect(() => {
    if (warned.current || initialMode.current === isControlled || !isDevelopmentBuild()) return;
    warned.current = true;
    const [from, to] = isControlled ? ["uncontrolled", "controlled"] : ["controlled", "uncontrolled"];
    console.warn(
      `gridory: \`${name}\` changed from ${from} to ${to}. Keep it ${from} for the whole lifetime of the component.`,
    );
  }, [isControlled, name]);
};

// Two updates in the same event (before the next render) must chain, as `useState` updaters do.
const useCurrentValueRef = <TValue>(current: TValue) => {
  const valueRef = useRef(current);
  useEffect(() => {
    valueRef.current = current;
  }, [current]);
  return valueRef;
};

/**
 * State that the consumer can own (`value` defined) or leave to the component. Updates
 * accept a value or an updater, resolve against the current value and only call
 * `onChange` when it really changes.
 */
export const useControllableState = <TValue>(config: ControllableStateConfig<TValue>) => {
  const [ownValue, setOwnValue] = useState(config.defaultValue);
  const isControlled = config.value !== undefined;
  useModeChangeWarning(isControlled, config.name);
  const current = isControlled ? (config.value as TValue) : ownValue;
  const valueRef = useCurrentValueRef(current);
  const onChangeRef = useLatestRef(config.onChange);
  const setValue = (update: StateUpdate<TValue>) => {
    const next = resolveUpdate(update, valueRef.current);
    if (Object.is(next, valueRef.current)) return;
    valueRef.current = next;
    if (!isControlled) setOwnValue(next);
    onChangeRef.current?.(next);
  };
  return [current, setValue] as const;
};
