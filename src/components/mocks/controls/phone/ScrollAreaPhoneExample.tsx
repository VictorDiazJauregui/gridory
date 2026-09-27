import { PhoneInput } from "../../../phone-input";
import { ControlExample } from "../ControlExample";
import { recordValueChange } from "../record-value-change";
import type { RecordingExampleProps } from "../record-value-change";

const TITLE = "Teléfono en el contenedor con scroll";

export const ScrollAreaPhoneExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={TITLE}>
    <PhoneInput defaultCountry="CA" onValueChange={recordValueChange(record, TITLE)} />
  </ControlExample>
);
