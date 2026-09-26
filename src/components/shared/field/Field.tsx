import { cn } from "../../../lib/cn";
import { assertFieldHasAccessibleName } from "./field-accessible-name";
import { buildFieldControlAttributes, resolveFieldLabelling, useFieldIds } from "./field-attributes";
import type { FieldProps } from "./field-props";
import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";
import { hasVisibleContent } from "./visible-content";

export const Field = (props: FieldProps) => {
  const { labelPosition = "top", required = false, error, className, children } = props;
  const ids = useFieldIds();
  assertFieldHasAccessibleName(props);
  const hasError = hasVisibleContent(error);
  const control = buildFieldControlAttributes({ ids, naming: props, required, hasError });
  const labelling = resolveFieldLabelling(props, ids.label);
  return (
    <div className={cn("gdy-field", className)} data-label-position={labelPosition}>
      {hasVisibleContent(props.label) && (
        <FieldLabel id={ids.label} controlId={ids.control} required={required}>
          {props.label}
        </FieldLabel>
      )}
      <div className="gdy-field-control">{children(control, labelling)}</div>
      {hasError && <FieldError id={ids.error}>{error}</FieldError>}
    </div>
  );
};
