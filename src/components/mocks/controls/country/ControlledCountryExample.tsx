import { useState } from "react";
import { CountrySelect } from "../../../country-select";
import type { CountryCode } from "../../../country-select";
import { ControlExample } from "../ControlExample";
import { recordValueChange } from "../record-value-change";
import type { RecordingExampleProps } from "../record-value-change";

const TITLE = "Obligatorio y controlado";

export const ControlledCountryExample = ({ record }: RecordingExampleProps) => {
  const [country, setCountry] = useState<CountryCode | null>("PE");
  const changeCountry = (value: CountryCode | null) => {
    setCountry(value);
    recordValueChange(record, TITLE)(value);
  };
  return (
    <ControlExample title={TITLE}>
      <CountrySelect required value={country} onValueChange={changeCountry} />
      <p className="text-xs text-muted-foreground">Valor actual: {country ?? "ninguno"}</p>
    </ControlExample>
  );
};
