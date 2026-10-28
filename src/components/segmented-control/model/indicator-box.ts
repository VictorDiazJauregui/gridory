import type { CSSProperties } from "react";

export interface IndicatorBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Offsets, not getBoundingClientRect: they ignore an ancestor's transform and the root's scroll, like the
// indicator. A hidden control gets no box, so once shown its indicator mounts in place instead of sliding in.
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
