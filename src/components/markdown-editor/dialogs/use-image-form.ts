import { useState } from "react";
import type { MarkdownDialogTexts } from "../types";
import type { ImageDialogProps } from "./dialog-types";
import { altFromFileName, findFileProblem } from "./image-file-rules";
import { useImageUpload } from "./use-image-upload";
import { useUrlField } from "./use-url-field";

export type ImageSource = "url" | "file";

type ImageFormOptions = Pick<ImageDialogProps, "uploadImage" | "uploadRules" | "onInsert"> & { texts: MarkdownDialogTexts };

const useImageFields = (texts: MarkdownDialogTexts) => {
  const [source, setSource] = useState<ImageSource>("url");
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const url = useUrlField(texts);
  return { source, setSource, file, setFile, alt, setAlt, title, setTitle, submitted, setSubmitted, url };
};

type ImageFields = ReturnType<typeof useImageFields>;
type ImageUploader = ReturnType<typeof useImageUpload>;

const createFileChooser = (fields: ImageFields, uploader: ImageUploader) => (file: File | null) => {
  fields.setFile(file);
  uploader.clearUploadError();
  if (file && fields.alt.trim() === "") fields.setAlt(altFromFileName(file));
};

export const useImageForm = ({ uploadImage, uploadRules, onInsert, texts }: ImageFormOptions) => {
  const fields = useImageFields(texts);
  const uploader = useImageUpload(uploadImage, texts.image.uploadFailed);
  const fileProblem = fields.file ? findFileProblem(fields.file, uploadRules, texts.image) : texts.image.missingFile;
  const insertWith = (url: string) => onInsert({ url, alt: fields.alt.trim(), title: fields.title.trim() || undefined });
  const submitFile = async (file: File) => {
    const uploadedUrl = await uploader.upload(file);
    if (uploadedUrl) insertWith(uploadedUrl);
  };
  const submit = () => {
    if (uploader.uploading) return;
    fields.setSubmitted(true);
    if (fields.alt.trim() === "") return;
    if (fields.source === "url" && fields.url.validate()) insertWith(fields.url.normalized);
    if (fields.source === "file" && fields.file && !fileProblem) void submitFile(fields.file);
  };
  const altError = fields.submitted && fields.alt.trim() === "" ? texts.image.missingAlt : null;
  const fileError = fields.submitted || fields.file ? fileProblem : null;
  return { ...fields, ...uploader, chooseFile: createFileChooser(fields, uploader), submit, altError, fileError };
};
