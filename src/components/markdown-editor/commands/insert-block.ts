import type { MarkdownCommand } from "./command-types";

export interface BlockContent {
  text: string;
  /** Where the cursor lands inside `text`; when left out it lands on the empty line after the block. */
  cursor?: number;
  /** Characters selected from `cursor` on, so typing replaces a placeholder. */
  selectLength?: number;
}

const BLOCK_SEPARATION = 2;

const countTrailingLineBreaks = (text: string): number => text.length - text.replace(/\n+$/, "").length;

const countLeadingLineBreaks = (text: string): number => text.length - text.replace(/^\n+/, "").length;

const paddingBefore = (before: string): string =>
  before.length === 0 ? "" : "\n".repeat(Math.max(0, BLOCK_SEPARATION - countTrailingLineBreaks(before)));

const paddingAfter = (after: string): string => "\n".repeat(Math.max(0, BLOCK_SEPARATION - countLeadingLineBreaks(after)));

export const insertBlock =
  ({ text: block, cursor, selectLength = 0 }: BlockContent): MarkdownCommand =>
  ({ text, selection }) => {
    const leading = paddingBefore(text.slice(0, selection.from));
    const trailing = paddingAfter(text.slice(selection.to));
    const cursorInBlock = cursor ?? block.length + BLOCK_SEPARATION;
    const cursorPosition = selection.from + leading.length + cursorInBlock;
    return {
      changes: [{ from: selection.from, to: selection.to, insert: `${leading}${block}${trailing}` }],
      selection: { from: cursorPosition, to: cursorPosition + selectLength },
    };
  };
