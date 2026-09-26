import type { CSSProperties } from "react";

export interface IndicatorBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Offsets instead of getBoundingClientRect: they are layout values, so a
// transform on an ancestor (a panel that scales in) does not distort them, and
// they ignore the root's scroll, as the absolutely positioned indicator does.
// A hidden control measures 0 wide: it gets no box, so its indicator mounts
// in place once shown instead of sliding in from the corner.
export const measureOptionBox = (option: HTMLElement | undefined): IndicatorBox | null => {
  if (!option || option.offsetWidth === 0) return null;
  return { x: option.offsetLeft, y: option.offsetTop, width: option.offsetWidth, height: option.offsetHeight };
};

export const isSameIndicatorBox = (current: IndicatorBox | null, next: IndicatorBox | null): boolean =>
  current?.x === next?.x &&
  current?.y === next?.y &&
  current?.width === next?.width &&
  current?.height === next?.height;

export const buildIndicatorStyle = (box: IndicatorBox | null): CSSProperties | undefined => {
  if (!box) return undefined;
  return {
    "--gdy-segmented-indicator-x": `${box.x}px`,
    "--gdy-segmented-indicator-y": `${box.y}px`,
    "--gdy-segmented-indicator-width": `${box.width}px`,
    "--gdy-segmented-indicator-height": `${box.height}px`,
  } as CSSProperties;
};
