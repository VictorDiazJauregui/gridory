import type { MarkdownReferenceDialogTexts } from "../types";
import type { ReferenceKind } from "./dialog-types";

interface ReferenceKindChoiceProps {
  kind: ReferenceKind;
  onChange: (kind: ReferenceKind) => void;
  texts: MarkdownReferenceDialogTexts;
}

const KIND_LABELS: Record<ReferenceKind, keyof MarkdownReferenceDialogTexts> = {
  link: "linkKind",
  footnote: "footnoteKind",
};

export const ReferenceKindChoice = ({ kind, onChange, texts }: ReferenceKindChoiceProps) => (
  <fieldset className="gdy-md-dialog-choice">
    <legend className="gdy-field-label">{texts.kind}</legend>
    {(["link", "footnote"] as const).map((option) => (
      <label key={option} className="gdy-md-dialog-option">
        <input type="radio" name="reference-kind" checked={kind === option} onChange={() => onChange(option)} />
        {texts[KIND_LABELS[option]]}
      </label>
    ))}
  </fieldset>
);
