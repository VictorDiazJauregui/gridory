import { useId, type FormEvent } from "react";
import { Tabs } from "radix-ui";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import type { MarkdownImageDialogTexts } from "../types";
import { DialogTextField } from "./DialogTextField";
import type { ImageDialogProps } from "./dialog-types";
import { ImageFilePanel, ImageUrlPanel } from "./ImageSourcePanels";
import { ImagePreview } from "./ImagePreview";
import { MarkdownDialogFrame } from "./MarkdownDialogFrame";
import { useImageForm, type ImageSource } from "./use-image-form";

type ImageForm = ReturnType<typeof useImageForm>;
type ImageFormProps = Pick<ImageDialogProps, "onInsert" | "uploadImage" | "uploadRules"> & { formId: string };

const ImageSourceTabs = ({ form, texts, rules, canUpload }: { form: ImageForm; texts: MarkdownImageDialogTexts; rules: ImageDialogProps["uploadRules"]; canUpload: boolean }) => (
  <Tabs.Root value={form.source} onValueChange={(value) => form.setSource(value as ImageSource)} className="gdy-md-image-tabs">
    {canUpload && (
      <Tabs.List className="gdy-md-image-tab-list" aria-label={texts.title}>
        <Tabs.Trigger value="url" className="gdy-md-image-tab">{texts.urlTab}</Tabs.Trigger>
        <Tabs.Trigger value="file" className="gdy-md-image-tab">{texts.fileTab}</Tabs.Trigger>
      </Tabs.List>
    )}
    <Tabs.Content value="url"><ImageUrlPanel form={form} texts={texts} /></Tabs.Content>
    {canUpload && <Tabs.Content value="file"><ImageFilePanel form={form} texts={texts} rules={rules} /></Tabs.Content>}
  </Tabs.Root>
);

const ImageForm = ({ onInsert, uploadImage, uploadRules, formId }: ImageFormProps) => {
  const { texts } = useMarkdownEditorContext("ImageDialog");
  const form = useImageForm({ uploadImage, uploadRules, onInsert, texts: texts.dialogs });
  const imageTexts = texts.dialogs.image;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.submit();
  };
  return (
    <form id={formId} className="gdy-md-dialog-fields" noValidate onSubmit={submit} aria-busy={form.uploading || undefined}>
      <ImageSourceTabs form={form} texts={imageTexts} rules={uploadRules} canUpload={Boolean(uploadImage)} />
      <ImagePreview form={form} label={imageTexts.preview} />
      <DialogTextField label={imageTexts.alt} value={form.alt} onChange={form.setAlt} required error={form.altError} hint={imageTexts.altHint} />
      <DialogTextField label={`${imageTexts.imageTitle} (${texts.dialogs.optional})`} value={form.title} onChange={form.setTitle} />
      {form.uploading && <p className="gdy-md-dialog-hint" role="status">{imageTexts.uploading}</p>}
      {form.uploadError && <p className="gdy-field-error" role="alert">{form.uploadError}</p>}
    </form>
  );
};

export const ImageDialog = ({ open, onOpenChange, ...formProps }: ImageDialogProps) => {
  const { texts } = useMarkdownEditorContext("ImageDialog");
  const formId = useId();
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title={texts.dialogs.image.title} formId={formId}>
      <ImageForm formId={formId} onInsert={formProps.onInsert} uploadImage={formProps.uploadImage} uploadRules={formProps.uploadRules} />
    </MarkdownDialogFrame>
  );
};
