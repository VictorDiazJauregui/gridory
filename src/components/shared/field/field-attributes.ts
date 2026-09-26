import { useId } from "react";
import type { AccessibleName } from "../accessible-name";
import type { FieldControlAttributes, FieldNaming } from "./field-props";

interface FieldIds {
  control: string;
  label: string;
  error: string;
}

interface FieldControlState {
  ids: FieldIds;
  naming: FieldNaming;
  required: boolean;
  hasError: boolean;
}

export const useFieldIds = (): FieldIds => {
  const fieldId = useId();
  return { control: `${fieldId}-control`, label: `${fieldId}-label`, error: `${fieldId}-error` };
};

export const buildFieldControlAttributes = ({
  ids,
  naming,
  required,
  hasError,
}: FieldControlState): FieldControlAttributes => ({
  id: ids.control,
  "aria-describedby": hasError ? ids.error : undefined,
  "aria-invalid": hasError || undefined,
  "aria-required": required || undefined,
  "aria-label": naming["aria-label"],
  "aria-labelledby": naming["aria-labelledby"],
});

// Same precedence as the accessible name computation, so the labelling names what
// the control announces. The label id is reached only after assertFieldHasAccessibleName
// guaranteed that, without aria naming, the visible label is rendered.
export const resolveFieldLabelling = (naming: FieldNaming, labelId: string): AccessibleName => {
  const { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy } = naming;
  if (ariaLabelledBy) return { "aria-labelledby": ariaLabelledBy };
  if (ariaLabel) return { "aria-label": ariaLabel };
  return { "aria-labelledby": labelId };
};
