import type { ComponentType } from "react";
import type { MarkdownEditorState } from "../types";

export interface ToolRunContext {
  editor: MarkdownEditorState;
}

export interface MarkdownToolIconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

export interface MarkdownToolMenuItem {
  id: string;
  label: string;
  icon?: ComponentType<MarkdownToolIconProps>;
  shortcut?: string;
  /** Extra class for the menu entry, such as a heading shown at its own size. */
  className?: string;
  run: (context: ToolRunContext) => void;
}

/** A toolbar button: a built-in one from the catalog or one of your own. */
export interface MarkdownTool {
  id: string;
  label: string;
  icon: ComponentType<MarkdownToolIconProps>;
  /** CodeMirror-style key, `Mod` being ⌘ on macOS and Ctrl elsewhere: `"Mod-b"`, `"Mod-Shift-x"`, `"Mod-Alt-1"`. */
  shortcut?: string;
  /** Runs on click or shortcut. Leave it out and give `items` for a tool that opens a menu. */
  run?: (context: ToolRunContext) => void;
  items?: readonly MarkdownToolMenuItem[];
  isDisabled?: (context: ToolRunContext) => boolean;
  /** Makes the button a toggle: `aria-pressed` follows what this returns. */
  isActive?: (context: ToolRunContext) => boolean;
}
