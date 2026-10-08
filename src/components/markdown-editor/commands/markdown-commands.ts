import type { MarkdownAlertVariant } from "../types";
import type { MarkdownCommand } from "./command-types";
import { insertBlock } from "./insert-block";
import { prefixLines } from "./prefix-lines";
import { transformCase } from "./transform-case";
import { wrapSelection } from "./wrap-selection";

export type MarkdownHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HEADING_PREFIX = /^#{1,6}\s+/;
const LIST_PREFIX = /^(?:[-*+]|\d+\.)\s+(?:\[[ xX]\]\s+)?/;
const ALERT_MARKERS: Record<MarkdownAlertVariant, string> = {
  info: "NOTE",
  success: "TIP",
  important: "IMPORTANT",
  warning: "WARNING",
  error: "CAUTION",
};

const heading = (level: MarkdownHeadingLevel): MarkdownCommand =>
  prefixLines(`${"#".repeat(level)} `, { present: new RegExp(`^#{${level}}\\s`), rivals: HEADING_PREFIX });

const alert =
  (variant: MarkdownAlertVariant): MarkdownCommand =>
  (snapshot) => {
    const selected = snapshot.text.slice(snapshot.selection.from, snapshot.selection.to);
    const body = (selected || "").split("\n").map((line) => `> ${line}`).join("\n");
    const text = `> [!${ALERT_MARKERS[variant]}]\n${body}`;
    return insertBlock({ text, cursor: text.length })(snapshot);
  };

export const markdownCommands = {
  bold: wrapSelection("**"),
  italic: wrapSelection("*"),
  strikethrough: wrapSelection("~~"),
  inlineCode: wrapSelection("`"),
  uppercase: transformCase("upper"),
  lowercase: transformCase("lower"),
  capitalize: transformCase("words"),
  heading,
  quote: prefixLines("> ", { present: /^>\s?/ }),
  bulletList: prefixLines("- ", { present: /^[-*+]\s+(?!\[[ xX]\]\s)/, rivals: LIST_PREFIX }),
  orderedList: prefixLines((index) => `${index + 1}. `, { present: /^\d+\.\s/, rivals: LIST_PREFIX }),
  taskList: prefixLines("- [ ] ", { present: /^[-*+]\s+\[[ xX]\]\s/, rivals: LIST_PREFIX }),
  horizontalRule: insertBlock({ text: "---" }),
  alert,
} as const;
