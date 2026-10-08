import type { MarkdownTool } from "../tools/tool-types";
import { DEFAULT_GUIDE_SECTIONS } from "./default-guide-sections";
import type { MarkdownGuideConfig, MarkdownGuideSection } from "./guide-types";

export const readVisibleGuideSections = (config: MarkdownGuideConfig, toolGroups: readonly MarkdownTool[][]): MarkdownGuideSection[] => {
  const toolIds = new Set(toolGroups.flat().map((tool) => tool.id));
  const sections = config.sections?.(DEFAULT_GUIDE_SECTIONS) ?? DEFAULT_GUIDE_SECTIONS;
  return sections.filter((section) => section.toolIds.length === 0 || section.toolIds.some((id) => toolIds.has(id)));
};
