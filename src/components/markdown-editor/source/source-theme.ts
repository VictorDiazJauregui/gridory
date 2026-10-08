import { EditorView } from "@codemirror/view";

const SOURCE_THEME_SPEC = {
  "&": {
    height: "100%",
    color: "var(--gdy-md-source-foreground, var(--gdy-foreground))",
    backgroundColor: "var(--gdy-md-source-background, var(--gdy-md-editor-background, var(--gdy-background)))",
    fontSize: "var(--gdy-md-source-font-size, 0.875rem)",
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "var(--gdy-md-source-font-family, var(--gdy-font-mono))",
    lineHeight: "var(--gdy-md-source-line-height, 1.65)",
  },
  ".cm-content": {
    padding: "var(--gdy-md-source-padding, 0.75rem 1rem)",
    caretColor: "var(--gdy-md-source-caret, var(--gdy-foreground))",
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--gdy-md-source-caret, var(--gdy-foreground))" },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, ::selection": {
    backgroundColor: "var(--gdy-md-source-selection, color-mix(in oklab, var(--gdy-primary) 22%, transparent))",
  },
  ".cm-placeholder": { color: "var(--gdy-md-source-placeholder, var(--gdy-muted-foreground))" },
  ".cm-activeLine": { backgroundColor: "transparent" },
  ".cm-panels": {
    backgroundColor: "var(--gdy-md-panel-background, var(--gdy-card))",
    color: "var(--gdy-md-panel-foreground, var(--gdy-foreground))",
  },
  ".cm-panels.cm-panels-top": { borderBottom: "1px solid var(--gdy-md-border, var(--gdy-border))" },
  ".cm-search, .cm-dialog": {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.375rem",
    padding: "0.5rem 2.25rem 0.5rem 0.75rem",
    fontSize: "0.8125rem",
  },
  ".cm-search label, .cm-dialog label": { display: "inline-flex", alignItems: "center", gap: "0.25rem" },
  ".cm-search br": { flexBasis: "100%", height: 0 },
  ".cm-textfield": {
    padding: "0.25rem 0.5rem",
    border: "1px solid var(--gdy-md-border, var(--gdy-input))",
    borderRadius: "calc(var(--gdy-radius) - 4px)",
    backgroundColor: "var(--gdy-md-source-background, var(--gdy-md-editor-background, var(--gdy-background)))",
    color: "inherit",
    fontSize: "inherit",
  },
  ".cm-textfield:focus": { outline: "2px solid var(--gdy-ring)", outlineOffset: "-1px" },
  ".cm-button": {
    padding: "0.25rem 0.625rem",
    border: "1px solid var(--gdy-md-border, var(--gdy-border))",
    borderRadius: "calc(var(--gdy-radius) - 4px)",
    backgroundImage: "none",
    backgroundColor: "var(--gdy-md-panel-button, var(--gdy-secondary))",
    color: "inherit",
    fontSize: "inherit",
  },
  ".cm-button:active": { backgroundImage: "none", backgroundColor: "var(--gdy-accent)" },
  ".cm-panel.cm-search [name=close], .cm-dialog-close": {
    top: "0.5rem",
    right: "0.5rem",
    color: "var(--gdy-muted-foreground)",
    fontSize: "1.125rem",
  },
  ".cm-searchMatch": {
    backgroundColor: "var(--gdy-md-search-match, color-mix(in oklab, var(--gdy-warning) 28%, transparent))",
    outline: "none",
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "var(--gdy-md-search-match-active, color-mix(in oklab, var(--gdy-warning) 55%, transparent))",
  },
};

export const createSourceTheme = () => EditorView.theme(SOURCE_THEME_SPEC);
