import type { MarkdownGuideSection } from "../guide/guide-types";
import type { MarkdownTool } from "../tools/tool-types";
import type { MarkdownDiagramTemplate } from "../diagrams/diagram-templates";
import type { MarkdownDiagramRenderer } from "../diagrams/diagram-types";
import type { ComponentType } from "react";
import type { MarkdownCodeLanguage } from "../code/code-languages";
import type { MarkdownEditorLimits } from "../types";

/** What every editor dialog receives. It returns plain data through `onInsert`; the editor writes the Markdown. */
export interface MarkdownDialogProps<Insert> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (value: Insert) => void;
  /** The text selected in the editor when the dialog opened. */
  selectedText: string;
}

export interface LinkInsert {
  text: string;
  url: string;
  title?: string;
}

export type ReferenceKind = "link" | "footnote";

export interface ReferenceInsert {
  kind: ReferenceKind;
  /** Visible text of a reference link; ignored by a footnote, which marks the cursor. */
  text: string;
  /** The URL of a reference link, or the note of a footnote. */
  content: string;
  /** Identifier written in the document; the next free number when left out. */
  id?: string;
}

export interface ReferenceDialogProps extends MarkdownDialogProps<ReferenceInsert> {
  /** Identifiers already defined in the document, so a new one does not repeat them. */
  existingIds: Record<ReferenceKind, readonly string[]>;
}

export interface ImageInsert {
  url: string;
  alt: string;
  title?: string;
}

/** What the app's upload returns: where the file now lives and, optionally, a suggested alt text. */
export interface UploadedImage {
  url: string;
  alt?: string;
}

export type ImageUploadHandler = (file: File) => Promise<UploadedImage>;

export interface ImageUploadRules {
  acceptedTypes: readonly string[];
  maxBytes: number;
}

export interface ImageDialogProps extends MarkdownDialogProps<ImageInsert> {
  /** Present only when the app passed `onImageUpload`; without it the dialog offers URLs only. */
  uploadImage?: ImageUploadHandler;
  uploadRules: ImageUploadRules;
}

export interface CodeInsert {
  /** Id of a language from `codeLanguages`; the plain-text one writes a fence without a language. */
  language: string;
  code: string;
}

export interface CodeDialogProps extends MarkdownDialogProps<CodeInsert> {
  languages: readonly MarkdownCodeLanguage[];
}

export type TableAlignment = "left" | "center" | "right";

export interface TableInsert {
  /** Body rows; the header row always exists and is not counted. */
  rows: number;
  columns: number;
  alignment: TableAlignment;
}

export interface TableDialogProps extends MarkdownDialogProps<TableInsert> {
  limits: MarkdownEditorLimits;
}

export interface SymbolInsert {
  text: string;
}

export interface EmojiDialogProps extends MarkdownDialogProps<SymbolInsert> {
  recentEmojis: readonly string[];
}

export interface DiagramInsert {
  code: string;
}

export interface DiagramDialogProps extends MarkdownDialogProps<DiagramInsert> {
  templates: readonly MarkdownDiagramTemplate[];
  /** Draws the live preview, the same way the editor's preview does. */
  diagrams: MarkdownDiagramRenderer;
}

export interface GuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Sections whose tools are in the toolbar, after `guide.sections`. */
  sections: readonly MarkdownGuideSection[];
  /** The toolbar's tools, for their icons and shortcuts. */
  tools: readonly MarkdownTool[];
}

export interface MarkdownDialogComponents {
  link: ComponentType<MarkdownDialogProps<LinkInsert>>;
  reference: ComponentType<ReferenceDialogProps>;
  image: ComponentType<ImageDialogProps>;
  code: ComponentType<CodeDialogProps>;
  table: ComponentType<TableDialogProps>;
  emoji: ComponentType<EmojiDialogProps>;
  htmlEntity: ComponentType<MarkdownDialogProps<SymbolInsert>>;
  diagram: ComponentType<DiagramDialogProps>;
  guide: ComponentType<GuideDialogProps>;
}
