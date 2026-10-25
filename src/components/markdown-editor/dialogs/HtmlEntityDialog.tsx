import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import { HTML_ENTITIES } from "../pickers/html-entities";
import { PickerGrid } from "../pickers/PickerGrid";
import type { MarkdownDialogProps, SymbolInsert } from "./dialog-types";
import { MarkdownDialogFrame } from "./MarkdownDialogFrame";

const EntityContent = ({ character, entity }: { character: string; entity: string }) => (
  <>
    <span className="gdy-md-entity-character" aria-hidden>{character}</span>
    <span className="gdy-md-entity-code" aria-hidden>{entity}</span>
  </>
);

export const HtmlEntityDialog = ({ open, onOpenChange, onInsert }: MarkdownDialogProps<SymbolInsert>) => {
  const title = useMarkdownEditorContext("HtmlEntityDialog").texts.dialogs.htmlEntityTitle;
  const options = HTML_ENTITIES.map((item) => ({
    key: item.entity,
    label: `${item.name} (${item.entity})`,
    content: <EntityContent character={item.character} entity={item.entity} />,
    onPick: () => onInsert({ text: item.entity }),
  }));
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title={title} className="gdy-md-picker-dialog">
      <PickerGrid label={title} options={options} className="gdy-md-entity-grid" />
    </MarkdownDialogFrame>
  );
};
