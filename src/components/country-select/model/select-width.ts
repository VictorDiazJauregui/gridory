import type { CSSProperties } from "react";

type SelectWidth = number | string | undefined;

/** Writes `width` as the width token, which the frame's single column never exceeds. */
export const buildSelectWidthStyle = (width: SelectWidth): CSSProperties | undefined => {
  if (width === undefined) return undefined;
  const cssWidth = typeof width === "number" ? `${width}px` : width;
  return { "--gdy-country-select-width": cssWidth } as CSSProperties;
};
