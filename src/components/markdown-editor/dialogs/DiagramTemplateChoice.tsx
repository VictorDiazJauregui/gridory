import type { MarkdownDiagramTemplate } from "../diagrams/diagram-templates";

interface DiagramTemplateChoiceProps {
  legend: string;
  templates: readonly MarkdownDiagramTemplate[];
  selectedId: string | null;
  onSelect: (template: MarkdownDiagramTemplate) => void;
}

export const DiagramTemplateChoice = ({ legend, templates, selectedId, onSelect }: DiagramTemplateChoiceProps) => (
  <fieldset className="gdy-md-dialog-choice">
    <legend className="gdy-field-label">{legend}</legend>
    {templates.map((template) => (
      <label key={template.id} className="gdy-md-dialog-option">
        <input type="radio" name="diagram-template" checked={selectedId === template.id} onChange={() => onSelect(template)} />
        {template.label}
      </label>
    ))}
  </fieldset>
);
