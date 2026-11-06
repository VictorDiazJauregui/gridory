import { useEffect, useRef, useState } from "react";

// Swapping a focused placeholder for the downloaded control would drop the keyboard focus: the placeholder
// remembers it, and the control takes it back when it mounts.
export const usePlaceholderFocus = () => {
  const [focused, setFocused] = useState(false);
  const focusHandlers = { onFocus: () => setFocused(true), onBlur: () => setFocused(false) };
  return { focused, focusHandlers };
};

export const useFocusOnMount = <TElement extends HTMLElement>(shouldFocus = false) => {
  const ref = useRef<TElement>(null);
  useEffect(() => {
    if (shouldFocus) ref.current?.focus();
  }, [shouldFocus]);
  return ref;
};
