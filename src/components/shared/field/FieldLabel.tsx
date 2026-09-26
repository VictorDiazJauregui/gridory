import type { ReactNode } from "react";

interface FieldLabelProps {
  id: string;
  controlId: string;
  required: boolean;
  children: ReactNode;
}

const FieldRequiredMark = () => (
  <span className="gdy-field-required" aria-hidden="true">
    *
  </span>
);

export const FieldLabel = ({ id, controlId, required, children }: FieldLabelProps) => (
  <label id={id} htmlFor={controlId} className="gdy-field-label">
    {children}
    {required && <FieldRequiredMark />}
  </label>
);
