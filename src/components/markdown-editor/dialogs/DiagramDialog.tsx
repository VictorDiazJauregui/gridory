import { useId, useState, type FormEvent } from "react";
import type { MarkdownDiagramTemplate } from "../diagrams/diagram-templates";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import { MarkdownViewer } from "../viewer/MarkdownViewer";
import { DiagramTemplateChoice } from "./DiagramTemplateChoice";
import { DialogTextField } from "./DialogTextField";
import type { DiagramDialogProps } from "./dialog-types";
import { MarkdownDialogFrame } from "./MarkdownDialogFrame";

type DiagramFormProps = Omit<DiagramDialogProps, "open" | "onOpenChange"> & { formId: string };

const toMermaidBlock = (code: string): string => `\`\`\`mermaid\n${code}\n\`\`\``;

const useDiagramForm = ({ templates, selectedText }: Pick<DiagramFormProps, "templates" | "selectedText">) => {
  const startsFromSelection = selectedText.trim().length > 0;
  const [templateId, setTemplateId] = useState(startsFromSelection ? null : (templates[0]?.id ?? null));
  const [code, setCode] = useState(startsFromSelection ? selectedText : (templates[0]?.code ?? ""));
  const chooseTemplate = (template: MarkdownDiagramTemplate) => {
    setTemplateId(template.id);
    setCode(template.code);
  };
  return { templateId, code, setCode, chooseTemplate };
};

const DiagramForm = ({ formId, onInsert, templates, selectedText, diagrams }: DiagramFormProps) => {
  const texts = useMarkdownEditorContext("DiagramDialog").texts.dialogs.diagram;
  const form = useDiagramForm({ templates, selectedText });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onInsert({ code: form.code });
  };
  return (
    <form id={formId} className="gdy-md-dialog-fields" noValidate onSubmit={submit}>
      <DiagramTemplateChoice legend={texts.template} templates={templates} selectedId={form.templateId} onSelect={form.chooseTemplate} />
      <div className="gdy-md-diagram-editor">
        <DialogTextField label={texts.code} value={form.code} onChange={form.setCode} multiline />
        <MarkdownViewer value={toMermaidBlock(form.code)} diagrams={diagrams} aria-label={texts.preview} className="gdy-md-diagram-editor-preview" />
      </div>
    </form>
  );
};

export const DiagramDialog = ({ open, onOpenChange, ...formProps }: DiagramDialogProps) => {
  const { texts } = useMarkdownEditorContext("DiagramDialog");
  const formId = useId();
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title={texts.dialogs.diagram.title} formId={formId} className="gdy-md-diagram-dialog-frame">
      <DiagramForm formId={formId} {...formProps} />
    </MarkdownDialogFrame>
  );
};
