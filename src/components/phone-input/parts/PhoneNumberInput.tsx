import { cn } from "../../../lib/cn";
import type { FieldControlAttributes } from "../../shared/field/field-props";
import type { PhoneInputView } from "../model/use-phone-input";

/** The field's control attributes plus the form name of the number. */
export type PhoneNumberAttributes = FieldControlAttributes & { name?: string };

interface PhoneNumberInputProps {
  view: PhoneInputView;
  control: PhoneNumberAttributes;
  onBlur?: () => void;
}

// type="tel" and not "number": a number input adds arrows and drops "+",
// spaces and hyphens. The rule runs on the whole value in onChange, so pasted
// text is filtered too; a key handler would miss it.
export const PhoneNumberInput = ({ view, control, onBlur }: PhoneNumberInputProps) => (
  <input
    {...control}
    type="tel"
    inputMode="tel"
    autoComplete="tel-national"
    className={cn("gdy-phone-input-number", view.resolvedSettings.classNames?.number)}
    value={view.value.number}
    placeholder={view.resolvedSettings.placeholder}
    onChange={(event) => view.changeNumber(event.target.value)}
    onBlur={onBlur}
  />
);
