import { useMemo } from "react";
import { MARKDOWN_EDITOR_DEFAULTS } from "../constants";
import { resolveToolGroups, type MarkdownToolbarConfig, type UnavailableToolIds } from "../tools/resolve-tools";
import { createShortcutRunner } from "../tools/tool-shortcuts";
import type { MarkdownToolTexts } from "../types";

interface ToolGroupSettings {
  tools?: MarkdownToolbarConfig;
  texts: MarkdownToolTexts;
  hasDiagrams: boolean;
  hasFormulas: boolean;
  hasGuide: boolean;
}

type ToolFeatures = Pick<ToolGroupSettings, "hasDiagrams" | "hasFormulas" | "hasGuide">;

const readUnavailableTools = ({ hasDiagrams, hasFormulas, hasGuide }: ToolFeatures): UnavailableToolIds =>
  new Set(
    [
      { id: "diagram" as const, available: hasDiagrams },
      { id: "formula" as const, available: hasFormulas },
      { id: "guide" as const, available: hasGuide },
    ]
      .filter((feature) => !feature.available)
      .map((feature) => feature.id),
  );

export const useToolGroups = ({ tools = MARKDOWN_EDITOR_DEFAULTS.tools, texts, hasDiagrams, hasFormulas, hasGuide }: ToolGroupSettings) =>
  useMemo(() => {
    const toolGroups = resolveToolGroups(tools, texts, readUnavailableTools({ hasDiagrams, hasFormulas, hasGuide }));
    return { toolGroups, runShortcut: createShortcutRunner(toolGroups) };
  }, [tools, texts, hasDiagrams, hasFormulas, hasGuide]);
