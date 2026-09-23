import { useEffect, useRef, type RefObject } from "react";

export const useLatestRef = <TValue>(value: TValue): RefObject<TValue> => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
};
