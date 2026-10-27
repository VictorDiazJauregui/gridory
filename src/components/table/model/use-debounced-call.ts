import { useEffect, useRef } from "react";
import { useLatestRef } from "../../shared/use-latest-ref";

/** Delays `call` until `delayMs` pass without a new value; a pending call dies with the component. */
export const useDebouncedCall = <TValue>(call: (value: TValue) => void, delayMs: number) => {
  const callRef = useLatestRef(call);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancel = () => clearTimeout(timerRef.current);
  const schedule = (value: TValue) => {
    cancel();
    timerRef.current = setTimeout(() => callRef.current(value), delayMs);
  };
  useEffect(() => () => clearTimeout(timerRef.current), []);
  return { schedule, cancel };
};
