import type { MarkdownCommand } from "../commands/command-types";

export interface EditorController {
  apply: (command: MarkdownCommand) => void;
  undo: () => void;
  redo: () => void;
  focus: () => void;
  syncValue: (value: string) => void;
  openSearch: () => void;
  openReplace: () => void;
  openGoToLine: () => void;
  readSelectedText: () => string;
  destroy: () => void;
  /** The element that scrolls the source. */
  scrollElement: HTMLElement;
  /** The source line at the top edge of the visible area, 1-based, with the fraction already scrolled past. */
  readTopLine: () => number;
  scrollToLine: (line: number) => void;
  /** Puts the cursor at the start of the line and scrolls it to the top, without taking the focus. */
  revealLine: (line: number) => void;
  scrollToEnd: () => void;
}
