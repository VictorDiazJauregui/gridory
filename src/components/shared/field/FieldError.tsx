import type { ReactNode } from "react";

interface FieldErrorProps {
  id: string;
  children: ReactNode;
}

export const FieldError = ({ id, children }: FieldErrorProps) => (
  <p id={id} className="gdy-field-error">
    {children}
  </p>
);
