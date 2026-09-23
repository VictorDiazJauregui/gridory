import type { ReactNode } from "react";
import type { ToolbarSide } from "./toolbar-layout";

export interface SelectOption {
  value: string;
  label: string;
}

export type ToggleDisplay = "label" | "icon" | "both";

export interface ToggleOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface ToggleGroupConfig {
  id: string;
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  display?: ToggleDisplay;
  ariaLabel?: string;
  /** Toolbar side when no `toolbarLayout` is set. Defaults to `"right"`. */
  position?: ToolbarSide;
}

export interface HeaderSelectConfig {
  id: string;
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Toolbar side when no `toolbarLayout` is set. Defaults to `"right"`. */
  position?: ToolbarSide;
}
