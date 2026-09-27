import { PhoneInput } from "../../../phone-input";
import { ControlExample } from "../ControlExample";
import { recordValueChange } from "../record-value-change";
import type { RecordingExampleProps } from "../record-value-change";
import { CUSTOM_PHONE_TOKENS, PHONE_ERROR_MESSAGE } from "./phone-options";

const TOP_LABEL_TITLE = "Label arriba";
const START_LABEL_TITLE = "Label al costado";
const ERROR_TITLE = "Con error";
const NARROW_TITLE = "Angosto";
const CUSTOM_TOKENS_TITLE = "Personalizado (solo tokens)";

export const TopLabelPhoneExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={TOP_LABEL_TITLE}>
    <PhoneInput placeholder="999 111 222" onValueChange={recordValueChange(record, TOP_LABEL_TITLE)} />
  </ControlExample>
);

export const StartLabelPhoneExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={START_LABEL_TITLE}>
    <PhoneInput labelPosition="start" defaultCountry="PE" onValueChange={recordValueChange(record, START_LABEL_TITLE)} />
  </ControlExample>
);

export const ErrorPhoneExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={ERROR_TITLE}>
    <PhoneInput
      defaultValue={{ country: "CA", number: "12" }}
      error={PHONE_ERROR_MESSAGE}
      onValueChange={recordValueChange(record, ERROR_TITLE)}
    />
  </ControlExample>
);

export const NarrowPhoneExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={NARROW_TITLE}>
    <PhoneInput width={200} defaultValue={{ country: "PE", number: "999 111 222 333 444" }} onValueChange={recordValueChange(record, NARROW_TITLE)} />
  </ControlExample>
);

export const CustomTokensPhoneExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={CUSTOM_TOKENS_TITLE}>
    <div className="min-w-0" style={CUSTOM_PHONE_TOKENS}>
      <PhoneInput label="Celular" defaultCountry="UY" onValueChange={recordValueChange(record, CUSTOM_TOKENS_TITLE)} />
    </div>
  </ControlExample>
);
