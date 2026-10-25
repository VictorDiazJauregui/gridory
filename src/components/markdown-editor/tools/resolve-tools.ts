import type { MarkdownToolTexts } from "../types";
import { createBuiltInTools, MARKDOWN_TOOL_IDS, type MarkdownBuiltInToolId } from "./built-in-tools";
import type { MarkdownTool } from "./tool-types";
import { MARKDOWN_TOOLBAR_PRESETS } from "./toolbar-presets";

export const TOOLBAR_SEPARATOR = "|";

export type MarkdownToolbarPreset = "full" | "simple" | "minimal";

export type MarkdownToolbarItem = MarkdownBuiltInToolId | MarkdownTool | typeof TOOLBAR_SEPARATOR;

export type MarkdownToolbarConfig = MarkdownToolbarPreset | readonly MarkdownToolbarItem[];

export class UnknownMarkdownToolError extends Error {
  constructor(toolId: string) {
    super(`"${toolId}" is not a Markdown editor tool. Use one of: ${MARKDOWN_TOOL_IDS.join(", ")}, or pass a tool object`);
    this.name = "UnknownMarkdownToolError";
  }
}

const isBuiltInToolId = (item: string): item is MarkdownBuiltInToolId => (MARKDOWN_TOOL_IDS as readonly string[]).includes(item);

const resolveItem = (item: MarkdownBuiltInToolId | MarkdownTool, catalog: Record<MarkdownBuiltInToolId, MarkdownTool>): MarkdownTool => {
  if (typeof item !== "string") return item;
  if (!isBuiltInToolId(item)) throw new UnknownMarkdownToolError(item);
  return catalog[item];
};

const splitIntoGroups = (items: readonly MarkdownToolbarItem[]): (MarkdownBuiltInToolId | MarkdownTool)[][] =>
  items.reduce<(MarkdownBuiltInToolId | MarkdownTool)[][]>(
    (groups, item) => (item === TOOLBAR_SEPARATOR ? [...groups, []] : [...groups.slice(0, -1), [...groups[groups.length - 1], item]]),
    [[]],
  );

/** Built-in tools whose feature the app has not set up, such as the diagram tool without a diagram renderer. */
export type UnavailableToolIds = ReadonlySet<MarkdownBuiltInToolId>;

export const resolveToolGroups = (config: MarkdownToolbarConfig, texts: MarkdownToolTexts, unavailable: UnavailableToolIds = new Set()): MarkdownTool[][] => {
  const items = typeof config === "string" ? MARKDOWN_TOOLBAR_PRESETS[config] : config;
  const catalog = createBuiltInTools(texts);
  return splitIntoGroups(items)
    .map((group) => group.filter((item) => typeof item !== "string" || !unavailable.has(item)).map((item) => resolveItem(item, catalog)))
    .filter((group) => group.length > 0);
};
