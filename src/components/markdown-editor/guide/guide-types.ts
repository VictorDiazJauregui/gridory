export type MarkdownGuideTab = "write" | "insert";

/** One topic of the syntax guide. */
export interface MarkdownGuideSection {
  id: string;
  tab: MarkdownGuideTab;
  title: string;
  description: string;
  /** Markdown shown as typed and as rendered, side by side. */
  examples: readonly string[];
  /** Tools that write this syntax: their icons show next to the title, and the section shows only while one of them is in the toolbar. Leave it empty for a section that always shows. */
  toolIds: readonly string[];
}

export interface MarkdownGuideConfig {
  /** Gets the built-in sections and returns the ones to show: add, remove or rewrite. */
  sections?: (defaults: readonly MarkdownGuideSection[]) => readonly MarkdownGuideSection[];
}
