import { useRef } from "react";
import { Button } from "../../ui/button";
import type { MarkdownImageDialogTexts } from "../types";
import { DialogTextField } from "./DialogTextField";
import type { ImageUploadRules } from "./dialog-types";
import type { useImageForm } from "./use-image-form";

type ImageForm = ReturnType<typeof useImageForm>;

export const ImageUrlPanel = ({ form, texts }: { form: ImageForm; texts: MarkdownImageDialogTexts }) => (
  <DialogTextField label={texts.url} value={form.url.value} onChange={form.url.setValue} required error={form.url.error} placeholder="https://" autoFocus />
);

interface ImageFilePanelProps {
  form: ImageForm;
  texts: MarkdownImageDialogTexts;
  rules: ImageUploadRules;
}

export const ImageFilePanel = ({ form, texts, rules }: ImageFilePanelProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="gdy-md-image-file">
      <input
        ref={inputRef}
        type="file"
        accept={rules.acceptedTypes.join(",")}
        className="gdy-md-image-file-input"
        aria-label={texts.file}
        onChange={(event) => form.chooseFile(event.target.files?.[0] ?? null)}
      />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>{texts.chooseFile}</Button>
      <span className="gdy-md-image-file-name">{form.file?.name}</span>
      {form.fileError && <p className="gdy-field-error" role="alert">{form.fileError}</p>}
    </div>
  );
};
