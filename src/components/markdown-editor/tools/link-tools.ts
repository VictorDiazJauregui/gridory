import { BookMarked, ImagePlus, Link, Sigma, SquareCode, Table, Workflow } from "lucide-react";
import { insertFormula } from "../commands/insert-formula";
import { MARKDOWN_DIALOG_IDS } from "../dialogs/dialog-ids";
import type { MarkdownToolTexts } from "../types";
import type { MarkdownTool } from "./tool-types";

export const createLinkTools = (texts: MarkdownToolTexts): Record<"link" | "reference" | "image" | "codeBlock" | "table" | "diagram" | "formula", MarkdownTool> => ({
  link: { id: "link", label: texts.link, icon: Link, shortcut: "Mod-k", run: ({ editor }) => editor.openDialog(MARKDOWN_DIALOG_IDS.link) },
  reference: { id: "reference", label: texts.reference, icon: BookMarked, run: ({ editor }) => editor.openDialog(MARKDOWN_DIALOG_IDS.reference) },
  codeBlock: { id: "codeBlock", label: texts.codeBlock, icon: SquareCode, run: ({ editor }) => editor.openDialog(MARKDOWN_DIALOG_IDS.code) },
  table: { id: "table", label: texts.table, icon: Table, run: ({ editor }) => editor.openDialog(MARKDOWN_DIALOG_IDS.table) },
  diagram: { id: "diagram", label: texts.diagram, icon: Workflow, run: ({ editor }) => editor.openDialog(MARKDOWN_DIALOG_IDS.diagram) },
  formula: { id: "formula", label: texts.formula, icon: Sigma, run: ({ editor }) => editor.apply(insertFormula) },
  image: { id: "image", label: texts.image, icon: ImagePlus, run: ({ editor }) => editor.openDialog(MARKDOWN_DIALOG_IDS.image) },
});
