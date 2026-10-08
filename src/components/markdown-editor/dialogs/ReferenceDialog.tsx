import { useId, type FormEvent } from "react";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import type { MarkdownReferenceDialogTexts } from "../types";
import { DialogTextField } from "./DialogTextField";
import type { ReferenceDialogProps } from "./dialog-types";
import { MarkdownDialogFrame } from "./MarkdownDialogFrame";
import { ReferenceKindChoice } from "./ReferenceKindChoice";
import { useReferenceForm } from "./use-reference-form";

type ReferenceForm = ReturnType<typeof useReferenceForm>;
type ReferenceFormProps = Pick<ReferenceDialogProps, "onInsert" | "selectedText" | "existingIds"> & { formId: string };

const ReferenceContentFields = ({ form, texts }: { form: ReferenceForm; texts: MarkdownReferenceDialogTexts }) => {
  if (form.kind === "footnote") {
    return <DialogTextField label={texts.note} value={form.note} onChange={form.setNote} required error={form.noteError} multiline autoFocus />;
  }
  return (
    <>
      <DialogTextField label={texts.url} value={form.url.value} onChange={form.url.setValue} required error={form.url.error} autoFocus />
      <DialogTextField label={texts.text} value={form.text} onChange={form.setText} />
    </>
  );
};

const ReferenceFormFields = ({ onInsert, selectedText, existingIds, formId }: ReferenceFormProps) => {
  const { texts } = useMarkdownEditorContext("ReferenceDialog");
  const form = useReferenceForm({ existingIds, selectedText, texts: texts.dialogs });
  const referenceTexts = texts.dialogs.reference;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const reference = form.readInsert();
    if (reference) onInsert(reference);
  };
  return (
    <form id={formId} className="gdy-md-dialog-fields" noValidate onSubmit={submit}>
      <ReferenceKindChoice kind={form.kind} onChange={form.setKind} texts={referenceTexts} />
      <ReferenceContentFields form={form} texts={referenceTexts} />
      <DialogTextField label={`${referenceTexts.id} (${texts.dialogs.optional})`} value={form.id} onChange={form.setId} error={form.idError} hint={referenceTexts.idHint.replace("{id}", form.nextId)} />
    </form>
  );
};

export const ReferenceDialog = ({ open, onOpenChange, ...formProps }: ReferenceDialogProps) => {
  const { texts } = useMarkdownEditorContext("ReferenceDialog");
  const formId = useId();
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title={texts.dialogs.reference.title} formId={formId}>
      <ReferenceFormFields formId={formId} {...formProps} />
    </MarkdownDialogFrame>
  );
};
