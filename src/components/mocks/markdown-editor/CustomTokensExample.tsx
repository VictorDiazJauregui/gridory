import type { CSSProperties } from "react";
import { MarkdownEditor } from "@/components/markdown-editor";
import { CUSTOM_TOKENS_SAMPLE } from "./markdown-samples";

const CUSTOM_TOKENS = {
  "--gdy-md-editor-height": "22rem",
  "--gdy-md-editor-radius": "14px",
  "--gdy-md-border": "#d6c7ae",
  "--gdy-md-header-background": "#f6efe3",
  "--gdy-md-editor-background": "#fffaf2",
  "--gdy-md-divider": "#c9a66b",
  "--gdy-md-divider-width": "2px",
  "--gdy-md-tool-foreground": "#7a5a2b",
  "--gdy-md-tool-active-background": "#ead9bb",
  "--gdy-md-source-font-family": "\"JetBrains Mono\", ui-monospace, monospace",
  "--gdy-md-source-heading": "#8a4b14",
  "--gdy-md-preview-font-family": "Georgia, \"Times New Roman\", serif",
  "--gdy-md-heading-color": "#5b3410",
  "--gdy-md-link": "#9a3412",
  "--gdy-md-quote-border": "#c9a66b",
  "--gdy-md-quote-border-width": "6px",
  "--gdy-md-code-background": "#f3e8d6",
  "--gdy-md-table-header-background": "#ead9bb",
  "--gdy-md-table-stripe": "#faf3e7",
  "--gdy-md-alert-info": "#0e7490",
  "--gdy-md-alert-tint": "14%",
  "--gdy-md-scrollbar-thumb": "#c9a66b",
  "--gdy-md-scrollbar-size": "6px",
} as CSSProperties;

export const CustomTokensExample = () => (
  <div style={CUSTOM_TOKENS}>
    <MarkdownEditor defaultValue={CUSTOM_TOKENS_SAMPLE} tools="simple" />
  </div>
);
