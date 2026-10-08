import { useLayoutEffect, useRef } from "react";

export const useLatestRef = <Value>(value: Value) => {
  const latest = useRef(value);
  useLayoutEffect(() => {
    latest.current = value;
  });
  return latest;
};
