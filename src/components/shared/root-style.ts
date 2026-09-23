import type { CSSProperties } from "react";

interface RootStyleInput {
  scrollbarColor?: string;
  optionHoverColor?: string;
}

export const resolveRootStyle = ({
  scrollbarColor,
  optionHoverColor,
}: RootStyleInput): CSSProperties =>
  ({
    ...(scrollbarColor ? { ["--gdy-scrollbar-thumb"]: scrollbarColor } : {}),
    ...(optionHoverColor ? { ["--gdy-option-hover-bg"]: optionHoverColor } : {}),
  }) as CSSProperties;
