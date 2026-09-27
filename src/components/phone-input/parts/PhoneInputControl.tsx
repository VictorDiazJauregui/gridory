import type { FieldControlAttributes } from "../../shared/field/field-props";
import { FloatingPanel } from "../../shared/floating-panel/FloatingPanel";
import { usePhoneInput } from "../model/use-phone-input";
import type { PhoneInputSettings } from "../types";
import { PhoneInputBox } from "./PhoneInputBox";
import { PhoneInputPanel } from "./PhoneInputPanel";

export interface PhoneInputControlProps {
  settings: PhoneInputSettings;
  /** Id, name and ARIA state of the number, from the field or the form around it. */
  control: FieldControlAttributes;
  /** Form name of the number, for the forms that submit natively or autofill by name. */
  name?: string;
  onBlur?: () => void;
}

/**
 * The prefix, the number and the list, without the label and the error. Not
 * exported: the auth forms render it inside their own label and error.
 */
export const PhoneInputControl = ({ settings, control, name, onBlur }: PhoneInputControlProps) => {
  const view = usePhoneInput(settings);
  return (
    <FloatingPanel open={view.panel.open} onOpenChange={view.panel.changeOpen}>
      <PhoneInputBox view={view} control={{ ...control, name }} onBlur={onBlur} />
      <PhoneInputPanel view={view} />
    </FloatingPanel>
  );
};
