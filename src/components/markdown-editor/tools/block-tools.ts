import { CircleCheck, Heading, Info, List, ListChecks, ListOrdered, Megaphone, MessageSquareWarning, Minus, OctagonAlert, Quote, TriangleAlert } from "lucide-react";
import { markdownCommands, type MarkdownHeadingLevel } from "../commands/markdown-commands";
import type { MarkdownAlertVariant, MarkdownToolTexts } from "../types";
import { createCommandTool } from "./tool-factories";
import type { MarkdownTool, MarkdownToolMenuItem } from "./tool-types";

const HEADING_LEVELS: MarkdownHeadingLevel[] = [1, 2, 3, 4, 5, 6];
const ALERT_ICONS: Record<MarkdownAlertVariant, MarkdownTool["icon"]> = {
  info: Info,
  success: CircleCheck,
  important: MessageSquareWarning,
  warning: TriangleAlert,
  error: OctagonAlert,
};

const HEADING_OPTION_CLASSES: Record<MarkdownHeadingLevel, string> = {
  1: "gdy-md-heading-option gdy-md-heading-option-1",
  2: "gdy-md-heading-option gdy-md-heading-option-2",
  3: "gdy-md-heading-option gdy-md-heading-option-3",
  4: "gdy-md-heading-option gdy-md-heading-option-4",
  5: "gdy-md-heading-option gdy-md-heading-option-5",
  6: "gdy-md-heading-option gdy-md-heading-option-6",
};
const ALERT_OPTION_CLASSES: Record<MarkdownAlertVariant, string> = {
  info: "gdy-md-alert-option gdy-md-alert-option-info",
  success: "gdy-md-alert-option gdy-md-alert-option-success",
  important: "gdy-md-alert-option gdy-md-alert-option-important",
  warning: "gdy-md-alert-option gdy-md-alert-option-warning",
  error: "gdy-md-alert-option gdy-md-alert-option-error",
};

const createHeadingItem = (level: MarkdownHeadingLevel, texts: MarkdownToolTexts): MarkdownToolMenuItem => ({
  id: `heading${level}`,
  label: texts.headingLevel.replace("{level}", String(level)),
  shortcut: `Mod-Alt-${level}`,
  className: HEADING_OPTION_CLASSES[level],
  run: ({ editor }) => editor.apply(markdownCommands.heading(level)),
});

const createAlertItem = (variant: MarkdownAlertVariant, texts: MarkdownToolTexts): MarkdownToolMenuItem => ({
  id: `alert-${variant}`,
  label: texts.alertVariants[variant],
  icon: ALERT_ICONS[variant],
  className: ALERT_OPTION_CLASSES[variant],
  run: ({ editor }) => editor.apply(markdownCommands.alert(variant)),
});

export const createBlockTools = (texts: MarkdownToolTexts) => ({
  heading: { id: "heading", label: texts.heading, icon: Heading, items: HEADING_LEVELS.map((level) => createHeadingItem(level, texts)) },
  quote: createCommandTool({ id: "quote", label: texts.quote, icon: Quote, command: markdownCommands.quote }),
  bulletList: createCommandTool({ id: "bulletList", label: texts.bulletList, icon: List, command: markdownCommands.bulletList }),
  orderedList: createCommandTool({ id: "orderedList", label: texts.orderedList, icon: ListOrdered, command: markdownCommands.orderedList }),
  taskList: createCommandTool({ id: "taskList", label: texts.taskList, icon: ListChecks, command: markdownCommands.taskList }),
  horizontalRule: createCommandTool({ id: "horizontalRule", label: texts.horizontalRule, icon: Minus, command: markdownCommands.horizontalRule }),
  alert: {
    id: "alert",
    label: texts.alert,
    icon: Megaphone,
    items: (["info", "success", "important", "warning", "error"] as const).map((variant) => createAlertItem(variant, texts)),
  },
});
