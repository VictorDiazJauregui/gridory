import { formatImage, replaceMarker } from "../commands/insertions";
import { insertBlock } from "../commands/insert-block";
import { altFromFileName, findFileProblem } from "../dialogs/image-file-rules";
import type { MarkdownEditorContextValue } from "./markdown-editor-context";

const insertBlockAt = (position: number, text: string) => (snapshot: { text: string }) =>
  insertBlock({ text })({ text: snapshot.text, selection: { from: position, to: position } });

const createMarker = (placeholder: string): string => `![${placeholder}](#image-upload-${globalThis.crypto.randomUUID()})`;

const uploadIntoMarker = async (editor: MarkdownEditorContextValue, file: File, marker: string): Promise<void> => {
  const upload = editor.imageUpload.handler;
  if (!upload) return;
  try {
    const uploaded = await upload(file);
    editor.apply(replaceMarker(marker, formatImage({ url: uploaded.url, alt: uploaded.alt ?? altFromFileName(file) })));
  } catch {
    editor.apply(replaceMarker(marker, ""));
  }
};

export const uploadDroppedImages = (editor: MarkdownEditorContextValue, files: File[], position: number): boolean => {
  const { handler, rules } = editor.imageUpload;
  if (!handler) return false;
  const accepted = files.filter((file) => !findFileProblem(file, rules, editor.texts.dialogs.image));
  const markers = accepted.map(() => createMarker(editor.texts.dialogs.image.placeholder));
  if (markers.length > 0) editor.apply(insertBlockAt(position, markers.join("\n\n")));
  accepted.forEach((file, index) => void uploadIntoMarker(editor, file, markers[index]));
  return true;
};
