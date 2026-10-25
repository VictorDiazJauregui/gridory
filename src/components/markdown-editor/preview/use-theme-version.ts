import { useEffect, useState, type RefObject } from "react";

const THEME_ATTRIBUTES = ["class", "data-theme", "style"];

const readAncestors = (element: HTMLElement): HTMLElement[] => {
  const ancestors: HTMLElement[] = [];
  for (let current = element.parentElement; current; current = current.parentElement) ancestors.push(current);
  return ancestors;
};

/** Changes whenever an ancestor switches theme, so what the preview draws with the theme colors redraws. */
export const useThemeVersion = (elementRef: RefObject<HTMLElement | null>): number => {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    const observer = new MutationObserver(() => setVersion((current) => current + 1));
    readAncestors(element).forEach((ancestor) => observer.observe(ancestor, { attributes: true, attributeFilter: THEME_ATTRIBUTES }));
    return () => observer.disconnect();
  }, [elementRef]);
  return version;
};
