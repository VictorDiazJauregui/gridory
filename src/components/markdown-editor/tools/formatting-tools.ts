import { Bold, CaseLower, CaseSensitive, CaseUpper, Code, Italic, Strikethrough } from "lucide-react";
import { markdownCommands } from "../commands/markdown-commands";
import type { MarkdownToolTexts } from "../types";
import { createCommandTool } from "./tool-factories";

export const createFormattingTools = (texts: MarkdownToolTexts) => ({
  bold: createCommandTool({ id: "bold", label: texts.bold, icon: Bold, command: markdownCommands.bold, shortcut: "Mod-b" }),
  italic: createCommandTool({ id: "italic", label: texts.italic, icon: Italic, command: markdownCommands.italic, shortcut: "Mod-i" }),
  strikethrough: createCommandTool({
    id: "strikethrough",
    label: texts.strikethrough,
    icon: Strikethrough,
    command: markdownCommands.strikethrough,
    shortcut: "Mod-Shift-x",
  }),
  inlineCode: createCommandTool({ id: "inlineCode", label: texts.inlineCode, icon: Code, command: markdownCommands.inlineCode, shortcut: "Mod-e" }),
  uppercase: createCommandTool({ id: "uppercase", label: texts.uppercase, icon: CaseUpper, command: markdownCommands.uppercase }),
  lowercase: createCommandTool({ id: "lowercase", label: texts.lowercase, icon: CaseLower, command: markdownCommands.lowercase }),
  capitalize: createCommandTool({ id: "capitalize", label: texts.capitalize, icon: CaseSensitive, command: markdownCommands.capitalize }),
});
