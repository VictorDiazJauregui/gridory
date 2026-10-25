import { useId, useState, type FormEvent } from "react";
import { Listbox } from "../../shared/listbox/Listbox";
import { PLAIN_TEXT_LANGUAGE_ID } from "../code/code-languages";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import { DialogTextField } from "./DialogTextField";
import type { CodeDialogProps } from "./dialog-types";
import { MarkdownDialogFrame } from "./MarkdownDialogFrame";

type CodeFormProps = Pick<CodeDialogProps, "onInsert" | "selectedText" | "languages"> & { formId: string };

const CodeForm = ({ onInsert, selectedText, languages, formId }: CodeFormProps) => {
  const { texts } = useMarkdownEditorContext("CodeDialog");
  const [language, setLanguage] = useState(PLAIN_TEXT_LANGUAGE_ID);
  const [code, setCode] = useState(selectedText);
  const codeTexts = texts.dialogs.code;
  const options = languages.map((option) => ({ value: option.id, label: option.label, searchTerms: [...(option.aliases ?? [])] }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onInsert({ language, code });
  };
  return (
    <form id={formId} className="gdy-md-dialog-fields" noValidate onSubmit={submit}>
      <div className="gdy-md-code-language">
        <span className="gdy-field-label" id={`${formId}-language`}>{codeTexts.language}</span>
        <Listbox aria-labelledby={`${formId}-language`} options={options} selectedValues={[language]} onSelect={setLanguage} texts={{ searchLabel: codeTexts.searchLanguage, searchPlaceholder: codeTexts.searchLanguage, noResults: codeTexts.noLanguages }} />
      </div>
      <DialogTextField label={codeTexts.code} value={code} onChange={setCode} multiline />
    </form>
  );
};

export const CodeDialog = ({ open, onOpenChange, ...formProps }: CodeDialogProps) => {
  const { texts } = useMarkdownEditorContext("CodeDialog");
  const formId = useId();
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title={texts.dialogs.code.title} formId={formId}>
      <CodeForm formId={formId} {...formProps} />
    </MarkdownDialogFrame>
  );
};
