import type { MarkdownImageDialogTexts } from "../types";
import type { ImageUploadRules } from "./dialog-types";

const BYTES_PER_MEGABYTE = 1024 * 1024;

export const formatMegabytes = (bytes: number): string => `${Math.round((bytes / BYTES_PER_MEGABYTE) * 10) / 10} MB`;

export const findFileProblem = (file: File, rules: ImageUploadRules, texts: MarkdownImageDialogTexts): string | null => {
  if (!rules.acceptedTypes.includes(file.type)) return texts.invalidType;
  if (file.size > rules.maxBytes) return texts.tooLarge.replace("{size}", formatMegabytes(rules.maxBytes));
  return null;
};

export const altFromFileName = (file: File): string => file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
