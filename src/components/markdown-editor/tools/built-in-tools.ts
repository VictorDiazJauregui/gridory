import type { MarkdownToolTexts } from "../types";
import { createBlockTools } from "./block-tools";
import { createDocumentTools } from "./document-tools";
import { createFormattingTools } from "./formatting-tools";
import { createHistoryTools } from "./history-tools";
import { createLinkTools } from "./link-tools";
import { createSearchTools } from "./search-tools";
import { createSymbolTools } from "./symbol-tools";
import type { MarkdownTool } from "./tool-types";

export const MARKDOWN_TOOL_IDS = [
  "undo",
  "redo",
  "bold",
  "italic",
  "strikethrough",
  "inlineCode",
  "uppercase",
  "lowercase",
  "capitalize",
  "heading",
  "quote",
  "bulletList",
  "orderedList",
  "taskList",
  "horizontalRule",
  "alert",
  "link",
  "reference",
  "image",
  "codeBlock",
  "table",
  "diagram",
  "formula",
  "emoji",
  "htmlEntity",
  "dateTime",
  "search",
  "replace",
  "goToLine",
  "outline",
  "fullscreen",
  "clear",
  "guide",
] as const;

export type MarkdownBuiltInToolId = (typeof MARKDOWN_TOOL_IDS)[number];

export const createBuiltInTools = (texts: MarkdownToolTexts): Record<MarkdownBuiltInToolId, MarkdownTool> => ({
  ...createHistoryTools(texts),
  ...createFormattingTools(texts),
  ...createBlockTools(texts),
  ...createDocumentTools(texts),
  ...createSearchTools(texts),
  ...createLinkTools(texts),
  ...createSymbolTools(texts),
});
