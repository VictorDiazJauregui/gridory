import { Redo2, Undo2 } from "lucide-react";
import type { MarkdownToolTexts } from "../types";
import type { MarkdownTool } from "./tool-types";

export const createHistoryTools = (texts: MarkdownToolTexts): Record<"undo" | "redo", MarkdownTool> => ({
  undo: {
    id: "undo",
    label: texts.undo,
    icon: Undo2,
    shortcut: "Mod-z",
    run: ({ editor }) => editor.undo(),
    isDisabled: ({ editor }) => !editor.canUndo,
  },
  redo: {
    id: "redo",
    label: texts.redo,
    icon: Redo2,
    shortcut: "Mod-Shift-z",
    run: ({ editor }) => editor.redo(),
    isDisabled: ({ editor }) => !editor.canRedo,
  },
});
