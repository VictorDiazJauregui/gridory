import type { ReactNode } from "react";
import type { AccessibleName } from "../accessible-name";

export type FieldLabelPosition = "top" | "start";

interface VisibleLabelNaming {
  label: ReactNode;
  "aria-label"?: never;
  "aria-labelledby"?: never;
}

interface AriaLabelNaming {
  label?: never;
  "aria-label": string;
  "aria-labelledby"?: never;
}

interface AriaLabelledByNaming {
  label?: never;
  "aria-label"?: never;
  "aria-labelledby": string;
}

export type FieldNaming = VisibleLabelNaming | AriaLabelNaming | AriaLabelledByNaming;

export interface FieldControlAttributes {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export type FieldProps = FieldNaming & {
  /** Id of the control. Generated when left out; the label and the error ids are always generated. */
  id?: string;
  labelPosition?: FieldLabelPosition;
  required?: boolean;
  error?: ReactNode;
  className?: string;
  children: (control: FieldControlAttributes, labelling: AccessibleName) => ReactNode;
};
