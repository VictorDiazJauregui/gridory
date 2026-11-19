import type { ClipboardEvent } from "react";
import { cn } from "../../../lib/cn";
import type { FieldControlAttributes } from "../../shared/field/field-props";
import type { PhoneInputView } from "../model/use-phone-input";

export type PhoneNumberAttributes = FieldControlAttributes & { name?: string };

interface PhoneNumberInputProps {
  view: PhoneInputView;
  control: PhoneNumberAttributes;
  onBlur?: () => void;
}

// Only a paste over the whole number can bring a dial code: a paste in the middle is part of the number.
const replacesWholeNumber = (input: HTMLInputElement): boolean =>
  input.selectionStart === 0 && input.selectionEnd === input.value.length;

const handlePaste = (view: PhoneInputView) => (event: ClipboardEvent<HTMLInputElement>) => {
  if (!replacesWholeNumber(event.currentTarget)) return;
  if (view.pasteWholeNumber(event.clipboardData.getData("text"))) event.preventDefault();
};

// type="tel" and not "number": a number input adds arrows and drops "+", spaces and hyphens. The rule runs on
// the whole value in onChange, so pasted text is filtered too; a key handler would miss it.
export const PhoneNumberInput = ({ view, control, onBlur }: PhoneNumberInputProps) => (
  <input
    {...control}
    type="tel"
    inputMode="tel"
    autoComplete="tel-national"
    className={cn("gdy-phone-input-number", view.resolvedSettings.classNames?.number)}
    value={view.value.number}
    placeholder={view.resolvedSettings.placeholder}
    disabled={view.resolvedSettings.disabled}
    onChange={(event) => view.changeNumber(event.target.value)}
    onPaste={handlePaste(view)}
    onBlur={onBlur}
  />
);
