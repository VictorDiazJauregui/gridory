import type { MarkdownCommand } from "../commands/command-types";
import type { MarkdownTool } from "./tool-types";

export interface CommandToolSpec {
  id: string;
  label: string;
  icon: MarkdownTool["icon"];
  command: MarkdownCommand;
  shortcut?: string;
}

export const createCommandTool = ({ id, label, icon, command, shortcut }: CommandToolSpec): MarkdownTool => ({
  id,
  label,
  icon,
  shortcut,
  run: ({ editor }) => editor.apply(command),
});
