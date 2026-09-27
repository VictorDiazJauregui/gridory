import type { CSSProperties } from "react";

type PhoneWidth = number | string | undefined;

/** Writes `width` as the width token, which the frame's single column never exceeds. */
export const buildPhoneWidthStyle = (width: PhoneWidth): CSSProperties | undefined => {
  if (width === undefined) return undefined;
  const cssWidth = typeof width === "number" ? `${width}px` : width;
  return { "--gdy-phone-input-width": cssWidth } as CSSProperties;
};
