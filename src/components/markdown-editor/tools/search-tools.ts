import { ArrowDownToLine, Replace, Search } from "lucide-react";
import type { MarkdownToolTexts } from "../types";
import type { MarkdownTool } from "./tool-types";

export const createSearchTools = (texts: MarkdownToolTexts): Record<"search" | "replace" | "goToLine", MarkdownTool> => ({
  search: { id: "search", label: texts.search, icon: Search, shortcut: "Mod-f", run: ({ editor }) => editor.openSearch() },
  replace: { id: "replace", label: texts.replace, icon: Replace, shortcut: "Mod-h", run: ({ editor }) => editor.openReplace() },
  goToLine: { id: "goToLine", label: texts.goToLine, icon: ArrowDownToLine, shortcut: "Mod-g", run: ({ editor }) => editor.openGoToLine() },
});
