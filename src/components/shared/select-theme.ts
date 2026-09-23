import type { CSSProperties } from "react";

/**
 * Global styling hooks for the reusable Select. Any provided value takes
 * precedence over CSS variables and, in turn, over the default theme tokens.
 * Colors accept any CSS color; `radius` accepts a number (px) or a CSS length.
 */
export interface SelectTheme {
  background?: string;
  hoverBackground?: string;
  border?: string;
  text?: string;
  radius?: string | number;
  contentBackground?: string;
  optionText?: string;
  optionHoverBackground?: string;
  optionActiveBackground?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
}

const SELECT_VAR_BY_KEY: Record<string, string> = {
  background: "--gdy-select-bg",
  hoverBackground: "--gdy-select-trigger-hover-bg",
  border: "--gdy-select-border",
  text: "--gdy-select-text",
  contentBackground: "--gdy-select-content-bg",
  optionText: "--gdy-select-item-text",
  optionHoverBackground: "--gdy-select-item-hover-bg",
  optionActiveBackground: "--gdy-select-item-active-bg",
};

export function selectThemeToVars(theme?: SelectTheme): CSSProperties {
  if (!theme) return {};
  const vars: Record<string, string> = {};
  for (const [key, cssVar] of Object.entries(SELECT_VAR_BY_KEY)) {
    const value = theme[key as keyof SelectTheme];
    if (typeof value === "string") vars[cssVar] = value;
  }
  if (theme.radius != null) {
    vars["--gdy-select-radius"] =
      typeof theme.radius === "number" ? `${theme.radius}px` : theme.radius;
  }
  return vars as CSSProperties;
}
