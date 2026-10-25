import type { ReactNode } from "react";
/** Which panels the editor shows: both side by side, only the source or only the preview. */
export type MarkdownEditorView = "split" | "source" | "preview";

import type { MarkdownCommand } from "./commands/command-types";
import type { MarkdownCodeLanguage } from "./code/code-languages";
import type { MarkdownDiagramTemplate } from "./diagrams/diagram-templates";
import type { MarkdownDiagramRenderer } from "./diagrams/diagram-types";
import type { MarkdownFormulaRenderer } from "./formulas/formula-types";
import type { MarkdownGuideConfig } from "./guide/guide-types";
import type { ImageUploadHandler, MarkdownDialogComponents } from "./dialogs/dialog-types";
import type { MarkdownToolbarConfig } from "./tools/resolve-tools";

/** Upper bounds that keep generated content from breaking the document. */
export interface MarkdownEditorLimits {
  tableRows: number;
  tableColumns: number;
}

/** The five callouts, written with GitHub's alert syntax: `info` is `> [!NOTE]`, `success` is `[!TIP]`, `important` is `[!IMPORTANT]`, `warning` is `[!WARNING]` and `error` is `[!CAUTION]`. */
export type MarkdownAlertVariant = "info" | "success" | "important" | "warning" | "error";

/** Texts the rendered HTML shows or announces. */
/** Texts of the diagrams drawn from `mermaid` code blocks. */
export interface MarkdownDiagramTexts {
  /** Accessible name of each diagram. */
  label: string;
  rendering: string;
  error: string;
  expand: string;
  close: string;
}

/** Texts of the formulas drawn from `$…$` and `$$…$$`. */
export interface MarkdownFormulaTexts {
  /** Precedes the KaTeX message of a formula that does not parse. */
  error: string;
}

export interface MarkdownRenderTexts {
  alertTitles: Record<MarkdownAlertVariant, string>;
  diagram: MarkdownDiagramTexts;
  formula: MarkdownFormulaTexts;
  /** Accessible name of the footnotes section. */
  footnotes: string;
  /** Accessible name of the link that goes back from a footnote to its reference. */
  backToReference: string;
}

export interface MarkdownRenderOptions {
  /** Lets raw HTML inside the Markdown through, always sanitized. Off by default. */
  allowHtml?: boolean;
  /** Turns every single line break into `<br>`. Off by default, as in CommonMark. */
  breaks?: boolean;
  /** Replaces straight quotes and dashes with typographic ones. Off by default. */
  typographer?: boolean;
  /** Opens `http` and `https` links in a new tab, without access to the opener. On by default. */
  openExternalLinksInNewTab?: boolean;
  /** Prefix for heading and footnote ids, to keep them unique when several documents share a page. */
  idPrefix?: string;
  texts?: Partial<Omit<MarkdownRenderTexts, "alertTitles" | "diagram" | "formula">> & {
    alertTitles?: Partial<Record<MarkdownAlertVariant, string>>;
    diagram?: Partial<MarkdownDiagramTexts>;
    formula?: Partial<MarkdownFormulaTexts>;
  };
}

/** Names of the built-in tools, used by the buttons, the overflow menu and the guide. */
export interface MarkdownToolTexts {
  undo: string;
  redo: string;
  bold: string;
  italic: string;
  strikethrough: string;
  inlineCode: string;
  uppercase: string;
  lowercase: string;
  capitalize: string;
  heading: string;
  /** Name of each level in the heading menu; `{level}` is replaced by the number. */
  headingLevel: string;
  quote: string;
  bulletList: string;
  orderedList: string;
  taskList: string;
  horizontalRule: string;
  dateTime: string;
  search: string;
  replace: string;
  goToLine: string;
  link: string;
  reference: string;
  image: string;
  codeBlock: string;
  table: string;
  diagram: string;
  formula: string;
  emoji: string;
  htmlEntity: string;
  outline: string;
  fullscreen: string;
  clear: string;
  guide: string;
  alert: string;
  alertVariants: Record<MarkdownAlertVariant, string>;
}

/** Texts of the search, replace and go-to-line panels. */
export interface MarkdownSearchTexts {
  find: string;
  replace: string;
  next: string;
  previous: string;
  all: string;
  matchCase: string;
  regexp: string;
  byWord: string;
  replaceOne: string;
  replaceAll: string;
  close: string;
  goToLine: string;
  go: string;
  currentMatch: string;
  onLine: string;
  /** `$` is replaced by the line number. */
  replacedMatchOnLine: string;
  /** `$` is replaced by the number of matches. */
  replacedMatches: string;
}

export interface MarkdownLinkDialogTexts {
  title: string;
  text: string;
  url: string;
  urlPlaceholder: string;
  linkTitle: string;
}

export interface MarkdownReferenceDialogTexts {
  title: string;
  kind: string;
  linkKind: string;
  footnoteKind: string;
  text: string;
  url: string;
  note: string;
  id: string;
  /** `{id}` is replaced by the identifier the editor would pick. */
  idHint: string;
  duplicateId: string;
}

export interface MarkdownImageDialogTexts {
  title: string;
  urlTab: string;
  fileTab: string;
  url: string;
  file: string;
  chooseFile: string;
  alt: string;
  altHint: string;
  imageTitle: string;
  preview: string;
  uploading: string;
  uploadFailed: string;
  missingFile: string;
  missingAlt: string;
  invalidType: string;
  /** `{size}` is replaced by the maximum size, such as "5 MB". */
  tooLarge: string;
  /** Shown in the document while a pasted or dropped image uploads. */
  placeholder: string;
}

export interface MarkdownCodeDialogTexts {
  title: string;
  language: string;
  searchLanguage: string;
  noLanguages: string;
  code: string;
}

export interface MarkdownDiagramDialogTexts {
  title: string;
  template: string;
  code: string;
  preview: string;
}

export interface MarkdownGuideDialogTexts {
  title: string;
  write: string;
  insert: string;
  /** Accessible name of the Markdown of each example. */
  typed: string;
  /** Accessible name of the rendered result of each example. */
  rendered: string;
  empty: string;
}

export interface MarkdownTableDialogTexts {
  title: string;
  rows: string;
  columns: string;
  alignment: string;
  left: string;
  center: string;
  right: string;
  preview: string;
  /** `{rows}` and `{columns}` are replaced by the limits. */
  limitHint: string;
  clamped: string;
}

export interface MarkdownEmojiDialogTexts {
  title: string;
  search: string;
  recent: string;
  noResults: string;
  loading: string;
}

export interface MarkdownDialogTexts {
  cancel: string;
  insert: string;
  close: string;
  optional: string;
  missingUrl: string;
  invalidUrl: string;
  unsafeUrl: string;
  missingNote: string;
  link: MarkdownLinkDialogTexts;
  reference: MarkdownReferenceDialogTexts;
  image: MarkdownImageDialogTexts;
  code: MarkdownCodeDialogTexts;
  table: MarkdownTableDialogTexts;
  emoji: MarkdownEmojiDialogTexts;
  diagram: MarkdownDiagramDialogTexts;
  guide: MarkdownGuideDialogTexts;
  htmlEntityTitle: string;
}

export interface MarkdownClearDialogTexts {
  title: string;
  description: string;
  confirm: string;
  cancel: string;
}

/** Texts of the document outline panel. */
export interface MarkdownOutlineTexts {
  /** Heading and accessible name of the panel. */
  title: string;
  /** Shown while the document has no headings. */
  empty: string;
}

/** Texts of the editor itself. All are replaceable through `texts`. */
export interface MarkdownEditorTexts {
  /** Accessible name of the writing area. */
  sourceLabel: string;
  placeholder: string;
  /** Accessible name of the rendered preview. */
  previewLabel: string;
  /** Accessible name of the group that switches views. */
  viewSwitchLabel: string;
  viewLabels: Record<MarkdownEditorView, string>;
  /** Accessible name of the toolbar. */
  toolbarLabel: string;
  clearDialog: MarkdownClearDialogTexts;
  dialogs: MarkdownDialogTexts;
  search: MarkdownSearchTexts;
  outline: MarkdownOutlineTexts;
  /** Accessible name of the menu that holds the tools that do not fit. */
  moreTools: string;
  tools: MarkdownToolTexts;
}

/** What `useMarkdownEditor()` gives any part rendered inside `MarkdownEditorProvider`. */
export interface MarkdownEditorState {
  value: string;
  /** Runs a command on the current selection, as one undoable step. */
  apply: (command: MarkdownCommand) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  focus: () => void;
  openSearch: () => void;
  openReplace: () => void;
  openGoToLine: () => void;
  readSelectedText: () => string;
  view: MarkdownEditorView;
  views: readonly MarkdownEditorView[];
  changeView: (view: MarkdownEditorView) => void;
  fullscreen: boolean;
  changeFullscreen: (fullscreen: boolean) => void;
  /** Whether the document outline panel is open. */
  outlineOpen: boolean;
  changeOutline: (open: boolean) => void;
  /** Opens one of the editor's dialogs by id, such as `"clear"`. */
  openDialog: (dialogId: string) => void;
  /** Formats the current date and time the way the date tool writes it. */
  formatNow: () => string;
}

export interface MarkdownEditorProviderProps {
  /** Controlled Markdown. Leave it out and use `defaultValue` for an uncontrolled editor. */
  value?: string;
  defaultValue?: string;
  /** Fires with the whole Markdown on every edit, typed or applied by a tool. */
  onChange?: (value: string) => void;
  /** Controlled view. Leave it out and use `defaultView` for an uncontrolled editor. */
  view?: MarkdownEditorView;
  defaultView?: MarkdownEditorView;
  onViewChange?: (view: MarkdownEditorView) => void;
  /** Views the switch offers, in order; the switch hides itself when there is only one. */
  views?: readonly MarkdownEditorView[];
  renderOptions?: MarkdownRenderOptions;
  /** Fires when the fullscreen tool or Escape turns fullscreen on or off. */
  onFullscreenChange?: (fullscreen: boolean) => void;
  /** Controlled outline panel. Leave it out and use `defaultShowOutline` for an uncontrolled editor. */
  showOutline?: boolean;
  /** Opens the outline panel from the start; closed by default. */
  defaultShowOutline?: boolean;
  /** Fires when the outline tool opens or closes the panel. */
  onOutlineChange?: (open: boolean) => void;
  /** Locale of the date tool; the browser's when left out. */
  locale?: string;
  /** Replaces the date tool's text. */
  formatDateTime?: (date: Date, locale?: string) => string;
  /** A preset (`"full"`, `"simple"`, `"minimal"`) or a list of tool ids and tool objects, with `"|"` between groups. */
  tools?: MarkdownToolbarConfig;
  /** Uploads an image picked in the dialog, pasted or dropped, and resolves with its URL. Without it, images come from URLs only. */
  onImageUpload?: ImageUploadHandler;
  /** MIME types the upload accepts; PNG, JPEG, GIF and WebP by default. */
  acceptedImageTypes?: readonly string[];
  /** Largest file the upload accepts, in bytes; 5 MB by default. */
  maxImageBytes?: number;
  /** Largest table the table dialog creates; 20 rows by 10 columns by default. */
  limits?: Partial<MarkdownEditorLimits>;
  /** Draws `mermaid` code blocks as diagrams; pass `mermaidDiagrams` from `gridory/markdown-editor/mermaid`. Without it they show as code. */
  diagrams?: MarkdownDiagramRenderer;
  /** Draws `$…$` and `$$…$$` formulas; pass `katexFormulas` from `gridory/markdown-editor/katex`. Without it they show as text. */
  formulas?: MarkdownFormulaRenderer;
  /** Customizes the syntax guide; `false` removes its button. */
  guide?: false | MarkdownGuideConfig;
  /** Templates of the diagram dialog; `DEFAULT_DIAGRAM_TEMPLATES` when left out. */
  diagramTemplates?: readonly MarkdownDiagramTemplate[];
  /** Fires with the emoji picked in the emoji dialog, so the app can remember favorites if it wants. */
  onEmojiSelect?: (emoji: string) => void;
  /** Languages of the code dialog and the preview's coloring; `DEFAULT_CODE_LANGUAGES` when left out. */
  codeLanguages?: readonly MarkdownCodeLanguage[];
  /** Replaces any built-in dialog with your own; it receives the same props and returns the same data. */
  dialogs?: Partial<MarkdownDialogComponents>;
  texts?: Partial<Omit<MarkdownEditorTexts, "tools" | "viewLabels" | "clearDialog" | "search" | "outline" | "dialogs">> & {
    outline?: Partial<MarkdownOutlineTexts>;
    dialogs?: Partial<Omit<MarkdownDialogTexts, "link" | "reference" | "image" | "code" | "table" | "emoji" | "diagram" | "guide">> & {
      diagram?: Partial<MarkdownDiagramDialogTexts>;
      guide?: Partial<MarkdownGuideDialogTexts>;
      emoji?: Partial<MarkdownEmojiDialogTexts>;
      table?: Partial<MarkdownTableDialogTexts>;
      code?: Partial<MarkdownCodeDialogTexts>;
      link?: Partial<MarkdownLinkDialogTexts>;
      reference?: Partial<MarkdownReferenceDialogTexts>;
      image?: Partial<MarkdownImageDialogTexts>;
    };
    clearDialog?: Partial<MarkdownClearDialogTexts>;
    search?: Partial<MarkdownSearchTexts>;
    tools?: Partial<Omit<MarkdownToolTexts, "alertVariants">> & { alertVariants?: Partial<Record<MarkdownAlertVariant, string>> };
    viewLabels?: Partial<Record<MarkdownEditorView, string>>;
  };
  children: ReactNode;
}

/** Where `MarkdownEditor` puts its toolbar: above both panels, above the source only, or nowhere. */
export type MarkdownToolbarPlacement = "shared" | "source" | "none";

export interface MarkdownEditorProps extends Omit<MarkdownEditorProviderProps, "children"> {
  /** Scrolling one panel of the split view scrolls the other to the same block. On by default. */
  syncScroll?: boolean;
  toolbarPlacement?: MarkdownToolbarPlacement;
  className?: string;
}
