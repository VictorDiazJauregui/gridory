import type { ReactNode } from "react";
import type { ReusableToolbarSide } from "./toolbar-layout";

export interface ReusableSelectOption {
  value: string;
  label: string;
}

export type ReusableToggleDisplay = "label" | "icon" | "both";

export interface ReusableToggleOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface ReusableToggleGroupConfig {
  id: string;
  options: ReusableToggleOption[];
  value: string;
  onChange: (value: string) => void;
  display?: ReusableToggleDisplay;
  ariaLabel?: string;
  /** Toolbar side when no `toolbarLayout` is set. Defaults to `"right"`. */
  position?: ReusableToolbarSide;
}

export interface ReusableHeaderSelectConfig {
  id: string;
  label?: string;
  options: ReusableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Toolbar side when no `toolbarLayout` is set. Defaults to `"right"`. */
  position?: ReusableToolbarSide;
}
