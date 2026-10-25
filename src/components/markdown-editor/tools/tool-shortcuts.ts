import { isApplePlatform, normalizeShortcut, readShortcut } from "./shortcut-keys";
import type { MarkdownTool, MarkdownToolMenuItem, ToolRunContext } from "./tool-types";

const SHORTCUTS_HANDLED_BY_THE_EDITOR = new Set(["undo", "redo"]);

export type ShortcutRunner = (event: KeyboardEvent, context: ToolRunContext) => boolean;

interface ShortcutTarget {
  shortcut: string;
  run: MarkdownToolMenuItem["run"];
  isDisabled?: MarkdownTool["isDisabled"];
}

const toShortcutTargets = (tool: MarkdownTool): ShortcutTarget[] => {
  if (SHORTCUTS_HANDLED_BY_THE_EDITOR.has(tool.id)) return [];
  const own = tool.shortcut && tool.run ? [{ shortcut: tool.shortcut, run: tool.run, isDisabled: tool.isDisabled }] : [];
  const fromItems = (tool.items ?? []).flatMap((item) => (item.shortcut ? [{ shortcut: item.shortcut, run: item.run, isDisabled: tool.isDisabled }] : []));
  return [...own, ...fromItems];
};

export const createShortcutRunner = (groups: MarkdownTool[][]): ShortcutRunner => {
  const toolsByShortcut = new Map(groups.flat().flatMap(toShortcutTargets).map((target) => [normalizeShortcut(target.shortcut), target]));
  const onApple = isApplePlatform();
  return (event, context) => {
    const tool = toolsByShortcut.get(readShortcut(event, onApple));
    if (!tool || tool.isDisabled?.(context)) return false;
    event.preventDefault();
    tool.run(context);
    return true;
  };
};
