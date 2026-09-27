import { CountrySelect } from "../../../country-select";
import { ControlExample } from "../ControlExample";
import { recordValueChange } from "../record-value-change";
import type { RecordingExampleProps } from "../record-value-change";

const TITLE = "En el contenedor con scroll";

export const ScrollAreaCountryExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={TITLE}>
    <CountrySelect onValueChange={recordValueChange(record, TITLE)} />
  </ControlExample>
);
