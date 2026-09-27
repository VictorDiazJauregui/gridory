import { CountrySelect } from "../../../country-select";
import { ControlExample } from "../ControlExample";
import { recordValueChange } from "../record-value-change";
import type { RecordingExampleProps } from "../record-value-change";

const DEFAULT_TITLE = "Por defecto";
const NARROW_TITLE = "Angosto";
const WIDE_TITLE = "Ancho";
const MULTIPLE_TITLE = "Múltiple";

export const DefaultCountryExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={DEFAULT_TITLE}>
    <CountrySelect onValueChange={recordValueChange(record, DEFAULT_TITLE)} />
  </ControlExample>
);

// República Democrática del Congo is long enough to be truncated at this width.
export const NarrowCountryExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={NARROW_TITLE}>
    <CountrySelect width={140} defaultValue="CD" onValueChange={recordValueChange(record, NARROW_TITLE)} />
  </ControlExample>
);

export const WideCountryExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={WIDE_TITLE}>
    <CountrySelect width={360} onValueChange={recordValueChange(record, WIDE_TITLE)} />
  </ControlExample>
);

export const MultipleCountryExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={MULTIPLE_TITLE}>
    <CountrySelect
      multiple
      minSelected={1}
      maxSelected={3}
      defaultValue={["PE", "UY"]}
      onValueChange={recordValueChange(record, MULTIPLE_TITLE)}
    />
  </ControlExample>
);
