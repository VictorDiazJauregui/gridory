import { useId, useState, type FormEvent } from "react";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import { DialogTextField } from "./DialogTextField";
import type { LinkInsert, MarkdownDialogProps } from "./dialog-types";
import { MarkdownDialogFrame } from "./MarkdownDialogFrame";
import { useUrlField } from "./use-url-field";

type LinkFormProps = Pick<MarkdownDialogProps<LinkInsert>, "onInsert" | "selectedText"> & { formId: string };

const LinkForm = ({ onInsert, selectedText, formId }: LinkFormProps) => {
  const { texts } = useMarkdownEditorContext("LinkDialog");
  const [text, setText] = useState(selectedText);
  const [title, setTitle] = useState("");
  const url = useUrlField(texts.dialogs);
  const linkTexts = texts.dialogs.link;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (url.validate()) onInsert({ text: text.trim(), url: url.normalized, title: title.trim() || undefined });
  };
  return (
    <form id={formId} className="gdy-md-dialog-fields" noValidate onSubmit={submit}>
      <DialogTextField label={linkTexts.url} value={url.value} onChange={url.setValue} required error={url.error} placeholder={linkTexts.urlPlaceholder} autoFocus />
      <DialogTextField label={linkTexts.text} value={text} onChange={setText} />
      <DialogTextField label={`${linkTexts.linkTitle} (${texts.dialogs.optional})`} value={title} onChange={setTitle} />
    </form>
  );
};

export const LinkDialog = ({ open, onOpenChange, onInsert, selectedText }: MarkdownDialogProps<LinkInsert>) => {
  const { texts } = useMarkdownEditorContext("LinkDialog");
  const formId = useId();
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title={texts.dialogs.link.title} formId={formId}>
      <LinkForm formId={formId} onInsert={onInsert} selectedText={selectedText} />
    </MarkdownDialogFrame>
  );
};
