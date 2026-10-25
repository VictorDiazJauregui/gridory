import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import type { MarkdownTableDialogTexts } from "../types";
import type { TableAlignment } from "./dialog-types";

const ALIGNMENT_OPTIONS = [
  { value: "left", icon: AlignLeft, text: "left" },
  { value: "center", icon: AlignCenter, text: "center" },
  { value: "right", icon: AlignRight, text: "right" },
] as const;

interface TableAlignmentChoiceProps {
  alignment: TableAlignment;
  onChange: (alignment: TableAlignment) => void;
  texts: MarkdownTableDialogTexts;
}

export const TableAlignmentChoice = ({ alignment, onChange, texts }: TableAlignmentChoiceProps) => (
  <fieldset className="gdy-md-dialog-choice">
    <legend className="gdy-field-label">{texts.alignment}</legend>
    {ALIGNMENT_OPTIONS.map(({ value, icon: Icon, text }) => (
      <label key={value} className="gdy-md-dialog-option">
        <input type="radio" name="table-alignment" checked={alignment === value} onChange={() => onChange(value)} />
        <Icon aria-hidden className="gdy-md-tool-icon" />
        {texts[text]}
      </label>
    ))}
  </fieldset>
);
