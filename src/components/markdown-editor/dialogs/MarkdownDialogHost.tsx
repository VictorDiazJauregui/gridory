import type { ComponentType } from "react";
import { insertText } from "../commands/insert-text";
import { insertCodeBlock, insertImage, insertLink, insertReference, insertTable, readReferenceIds } from "../commands/insertions";
import type { MarkdownCommand } from "../commands/command-types";
import { useMarkdownEditorContext, type MarkdownEditorContextValue } from "../model/markdown-editor-context";
import { ClearDialog } from "./ClearDialog";
import { MARKDOWN_DIALOG_IDS } from "./dialog-ids";
import type { CodeInsert, ImageInsert, LinkInsert, TableInsert, DiagramInsert, MarkdownDialogComponents, MarkdownDialogProps, ReferenceInsert, SymbolInsert } from "./dialog-types";
import { CodeDialog } from "./CodeDialog";
import { DiagramDialog } from "./DiagramDialog";
import { GuideDialog } from "./GuideDialog";
import { readVisibleGuideSections } from "../guide/visible-guide-sections";
import { EmojiDialog } from "./EmojiDialog";
import { HtmlEntityDialog } from "./HtmlEntityDialog";
import { ImageDialog } from "./ImageDialog";
import { LinkDialog } from "./LinkDialog";
import { ReferenceDialog } from "./ReferenceDialog";
import { TableDialog } from "./TableDialog";

const DEFAULT_DIALOGS: MarkdownDialogComponents = {
  link: LinkDialog,
  reference: ReferenceDialog,
  image: ImageDialog,
  code: CodeDialog,
  table: TableDialog,
  emoji: EmojiDialog,
  htmlEntity: HtmlEntityDialog,
  diagram: DiagramDialog,
  guide: GuideDialog,
};

const insertSymbol = ({ text }: SymbolInsert) => insertText(text);

// The dialog unmounts as it closes, so Radix cannot hand the focus back itself.
const closeAndRefocus = (editor: MarkdownEditorContextValue) => (open: boolean) => {
  if (open) return;
  const returnFocusTo = editor.dialogReturnFocus;
  editor.closeDialog();
  window.setTimeout(() => (returnFocusTo?.isConnected ? returnFocusTo.focus() : editor.focus()), 0);
};

const createDialogProps = <Insert,>(editor: MarkdownEditorContextValue, dialogId: string, toCommand: (value: Insert) => MarkdownCommand): MarkdownDialogProps<Insert> => ({
  open: editor.activeDialog === dialogId,
  onOpenChange: closeAndRefocus(editor),
  selectedText: editor.dialogSelectedText,
  onInsert: (value) => {
    editor.closeDialog();
    window.setTimeout(() => editor.apply(toCommand(value)), 0);
  },
});

const useDialogComponents = (): MarkdownDialogComponents => ({ ...DEFAULT_DIALOGS, ...useMarkdownEditorContext("MarkdownDialogHost").dialogs });

const LinkDialogSlot = () => {
  const editor = useMarkdownEditorContext("MarkdownDialogHost");
  const { link: Link } = useDialogComponents();
  return <Link {...createDialogProps<LinkInsert>(editor, MARKDOWN_DIALOG_IDS.link, insertLink)} />;
};

const ReferenceDialogSlot = () => {
  const editor = useMarkdownEditorContext("MarkdownDialogHost");
  const { reference: Reference } = useDialogComponents();
  const existingIds = { link: readReferenceIds(editor.value, "link"), footnote: readReferenceIds(editor.value, "footnote") };
  return <Reference {...createDialogProps<ReferenceInsert>(editor, MARKDOWN_DIALOG_IDS.reference, insertReference)} existingIds={existingIds} />;
};

const ImageDialogSlot = () => {
  const editor = useMarkdownEditorContext("MarkdownDialogHost");
  const { image: Image } = useDialogComponents();
  const dialogProps = createDialogProps<ImageInsert>(editor, MARKDOWN_DIALOG_IDS.image, insertImage);
  return <Image {...dialogProps} uploadImage={editor.imageUpload.handler} uploadRules={editor.imageUpload.rules} />;
};

const CodeDialogSlot = () => {
  const editor = useMarkdownEditorContext("MarkdownDialogHost");
  const { code: Code } = useDialogComponents();
  return <Code {...createDialogProps<CodeInsert>(editor, MARKDOWN_DIALOG_IDS.code, insertCodeBlock)} languages={editor.codeLanguages} />;
};

const TableDialogSlot = () => {
  const editor = useMarkdownEditorContext("MarkdownDialogHost");
  const { table: Table } = useDialogComponents();
  return <Table {...createDialogProps<TableInsert>(editor, MARKDOWN_DIALOG_IDS.table, insertTable)} limits={editor.limits} />;
};

const EmojiDialogSlot = () => {
  const editor = useMarkdownEditorContext("MarkdownDialogHost");
  const { emoji: Emoji } = useDialogComponents();
  const dialogProps = createDialogProps<SymbolInsert>(editor, MARKDOWN_DIALOG_IDS.emoji, insertSymbol);
  const insertEmoji = (value: SymbolInsert) => {
    editor.emojiHistory.rememberEmoji(value.text);
    dialogProps.onInsert(value);
  };
  return <Emoji {...dialogProps} onInsert={insertEmoji} recentEmojis={editor.emojiHistory.recentEmojis} />;
};

const HtmlEntityDialogSlot = () => {
  const editor = useMarkdownEditorContext("MarkdownDialogHost");
  const { htmlEntity: HtmlEntity } = useDialogComponents();
  return <HtmlEntity {...createDialogProps<SymbolInsert>(editor, MARKDOWN_DIALOG_IDS.htmlEntity, insertSymbol)} />;
};

const insertDiagram = ({ code }: DiagramInsert) => insertCodeBlock({ language: "mermaid", code });

const DiagramDialogSlot = () => {
  const editor = useMarkdownEditorContext("MarkdownDialogHost");
  const { diagram: Diagram } = useDialogComponents();
  if (!editor.diagrams) return null;
  return <Diagram {...createDialogProps<DiagramInsert>(editor, MARKDOWN_DIALOG_IDS.diagram, insertDiagram)} templates={editor.diagramTemplates} diagrams={editor.diagrams} />;
};

const GuideDialogSlot = () => {
  const editor = useMarkdownEditorContext("MarkdownDialogHost");
  const { guide: Guide } = useDialogComponents();
  const sections = readVisibleGuideSections(editor.guide, editor.toolGroups);
  return <Guide open={editor.activeDialog === MARKDOWN_DIALOG_IDS.guide} onOpenChange={closeAndRefocus(editor)} sections={sections} tools={editor.toolGroups.flat()} />;
};

const DIALOG_SLOTS: Record<string, ComponentType> = {
  link: LinkDialogSlot,
  reference: ReferenceDialogSlot,
  image: ImageDialogSlot,
  code: CodeDialogSlot,
  table: TableDialogSlot,
  emoji: EmojiDialogSlot,
  htmlEntity: HtmlEntityDialogSlot,
  diagram: DiagramDialogSlot,
  guide: GuideDialogSlot,
};

const ActiveDialogSlot = ({ dialogId }: { dialogId: string }) => {
  const Slot = DIALOG_SLOTS[dialogId];
  return Slot ? <Slot /> : null;
};

export const MarkdownDialogHost = () => {
  const { activeDialog } = useMarkdownEditorContext("MarkdownDialogHost");
  return (
    <>
      <ClearDialog />
      {activeDialog && <ActiveDialogSlot dialogId={activeDialog} />}
    </>
  );
};
