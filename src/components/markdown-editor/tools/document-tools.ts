import { CalendarClock, CircleHelp, Eraser, ListTree, Maximize2 } from "lucide-react";
import { insertText } from "../commands/insert-text";
import { MARKDOWN_DIALOG_IDS } from "../dialogs/dialog-ids";
import type { MarkdownToolTexts } from "../types";
import type { MarkdownTool } from "./tool-types";

const createDateTimeTool = (label: string): MarkdownTool => ({
  id: "dateTime",
  label,
  icon: CalendarClock,
  run: ({ editor }) => editor.apply(insertText(editor.formatNow())),
});

const createFullscreenTool = (label: string): MarkdownTool => ({
  id: "fullscreen",
  label,
  icon: Maximize2,
  run: ({ editor }) => editor.changeFullscreen(!editor.fullscreen),
  isActive: ({ editor }) => editor.fullscreen,
});

const createOutlineTool = (label: string): MarkdownTool => ({
  id: "outline",
  label,
  icon: ListTree,
  run: ({ editor }) => editor.changeOutline(!editor.outlineOpen),
  isActive: ({ editor }) => editor.outlineOpen,
});

const createClearTool = (label: string): MarkdownTool => ({
  id: "clear",
  label,
  icon: Eraser,
  run: ({ editor }) => editor.openDialog(MARKDOWN_DIALOG_IDS.clear),
  isDisabled: ({ editor }) => editor.value.length === 0,
});

export const createDocumentTools = (texts: MarkdownToolTexts): Record<"dateTime" | "outline" | "fullscreen" | "clear" | "guide", MarkdownTool> => ({
  guide: { id: "guide", label: texts.guide, icon: CircleHelp, run: ({ editor }) => editor.openDialog(MARKDOWN_DIALOG_IDS.guide) },
  dateTime: createDateTimeTool(texts.dateTime),
  outline: createOutlineTool(texts.outline),
  fullscreen: createFullscreenTool(texts.fullscreen),
  clear: createClearTool(texts.clear),
});
