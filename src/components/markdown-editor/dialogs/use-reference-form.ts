import { useState } from "react";
import { nextReferenceId } from "../commands/insertions";
import type { MarkdownDialogTexts } from "../types";
import type { ReferenceDialogProps, ReferenceInsert, ReferenceKind } from "./dialog-types";
import { useUrlField } from "./use-url-field";

type ReferenceFormOptions = Pick<ReferenceDialogProps, "existingIds" | "selectedText"> & { texts: MarkdownDialogTexts };

const findIdProblem = (id: string, existing: readonly string[], texts: MarkdownDialogTexts): string | null =>
  existing.includes(id.trim()) ? texts.reference.duplicateId : null;

export const useReferenceForm = ({ existingIds, selectedText, texts }: ReferenceFormOptions) => {
  const [kind, setKind] = useState<ReferenceKind>("link");
  const [text, setText] = useState(selectedText);
  const [note, setNote] = useState("");
  const [id, setId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const url = useUrlField(texts);
  const idError = submitted ? findIdProblem(id, existingIds[kind], texts) : null;
  const noteError = submitted && kind === "footnote" && note.trim() === "" ? texts.missingNote : null;
  const readInsert = (): ReferenceInsert | null => {
    setSubmitted(true);
    const contentIsValid = kind === "link" ? url.validate() : note.trim() !== "";
    if (!contentIsValid || findIdProblem(id, existingIds[kind], texts)) return null;
    return { kind, text: text.trim(), content: kind === "link" ? url.normalized : note.trim(), id: id.trim() || undefined };
  };
  const nextId = nextReferenceId(existingIds[kind]);
  return { kind, setKind, text, setText, note, setNote, id, setId, url, idError, noteError, nextId, readInsert };
};
