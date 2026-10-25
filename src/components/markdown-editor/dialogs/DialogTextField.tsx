import { Field } from "../../shared/field/Field";

export interface DialogTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string | null;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
  autoFocus?: boolean;
}

export const DialogTextField = ({ label, value, onChange, required, error, hint, placeholder, multiline, autoFocus }: DialogTextFieldProps) => (
  <Field label={label} required={required} error={error ?? undefined}>
    {(control) => {
      const shared = { ...control, value, placeholder, autoFocus, onChange: (event: { target: { value: string } }) => onChange(event.target.value) };
      return (
        <>
          {multiline ? <textarea {...shared} rows={4} className="gdy-input gdy-md-dialog-textarea" /> : <input {...shared} type="text" className="gdy-input" />}
          {hint && <p className="gdy-md-dialog-hint">{hint}</p>}
        </>
      );
    }}
  </Field>
);
