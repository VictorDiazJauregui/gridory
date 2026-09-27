import { useLayoutEffect, useRef, useState } from "react";
import type { SegmentedOption } from "../types";
import { isSameIndicatorBox, measureOptionBox } from "./indicator-box";
import type { IndicatorBox } from "./indicator-box";
import { listOptionElements } from "./option-elements";

const observeBorderBoxes = (observer: ResizeObserver, elements: HTMLElement[]) => {
  for (const element of elements) observer.observe(element, { box: "border-box" });
};

// Options are keyed by value, so the same values render the same buttons: an
// `options` array rebuilt on every render of the app must not re-create the
// observer, while an added, removed or reordered option must.
const buildOptionsKey = (options: SegmentedOption[]): string =>
  options.map((option) => option.value).join("\u0000");

/**
 * Box of the chosen option, measured before paint when the choice changes and
 * again whenever the root or any option resizes (font size, width, a web font
 * that finishes loading).
 */
export const useIndicatorBox = (selectedIndex: number, options: SegmentedOption[]) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [indicatorBox, setIndicatorBox] = useState<IndicatorBox | null>(null);
  const optionsKey = buildOptionsKey(options);
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const measureSelectedOption = () => {
      const nextBox = measureOptionBox(listOptionElements(root)[selectedIndex]);
      setIndicatorBox((currentBox) => (isSameIndicatorBox(currentBox, nextBox) ? currentBox : nextBox));
    };
    measureSelectedOption();
    const observer = new ResizeObserver(measureSelectedOption);
    observeBorderBoxes(observer, [root, ...listOptionElements(root)]);
    return () => observer.disconnect();
  }, [selectedIndex, optionsKey]);
  return { rootRef, indicatorBox };
};
