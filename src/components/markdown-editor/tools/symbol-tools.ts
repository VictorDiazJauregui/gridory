import { Omega, Smile } from "lucide-react";
import { MARKDOWN_DIALOG_IDS } from "../dialogs/dialog-ids";
import type { MarkdownToolTexts } from "../types";
import type { MarkdownTool } from "./tool-types";

export const createSymbolTools = (texts: MarkdownToolTexts): Record<"emoji" | "htmlEntity", MarkdownTool> => ({
  emoji: { id: "emoji", label: texts.emoji, icon: Smile, run: ({ editor }) => editor.openDialog(MARKDOWN_DIALOG_IDS.emoji) },
  htmlEntity: { id: "htmlEntity", label: texts.htmlEntity, icon: Omega, run: ({ editor }) => editor.openDialog(MARKDOWN_DIALOG_IDS.htmlEntity) },
});
