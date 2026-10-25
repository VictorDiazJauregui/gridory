import { Field } from "../../shared/field/Field";

interface TableSizeFieldProps {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export const TableSizeField = ({ label, value, max, onChange }: TableSizeFieldProps) => (
  <Field label={label}>
    {(control) => (
      <input {...control} type="number" inputMode="numeric" min={1} max={max} value={value} className="gdy-input" onChange={(event) => onChange(event.target.valueAsNumber)} />
    )}
  </Field>
);
