import type { MarkdownToolbarItem, MarkdownToolbarPreset } from "./resolve-tools";

export const MARKDOWN_TOOLBAR_PRESETS: Record<MarkdownToolbarPreset, readonly MarkdownToolbarItem[]> = {
  full: [
    "undo", "redo", "|",
    "bold", "italic", "strikethrough", "inlineCode", "|",
    "uppercase", "lowercase", "capitalize", "|",
    "heading", "quote", "bulletList", "orderedList", "taskList", "|",
    "link", "reference", "image", "codeBlock", "table", "diagram", "formula", "|",
    "horizontalRule", "alert", "emoji", "htmlEntity", "dateTime", "|",
    "search", "replace", "goToLine", "|",
    "outline", "fullscreen", "clear", "guide",
  ],
  simple: ["undo", "redo", "|", "bold", "italic", "strikethrough", "|", "heading", "quote", "bulletList", "orderedList", "|", "link", "image", "table", "horizontalRule", "|", "fullscreen", "guide"],
  minimal: ["undo", "redo", "|", "bold", "italic"],
};
