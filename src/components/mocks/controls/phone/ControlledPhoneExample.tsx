import { useState } from "react";
import { PhoneInput } from "../../../phone-input";
import type { PhoneInputValue } from "../../../phone-input";
import { ControlExample } from "../ControlExample";
import { recordValueChange } from "../record-value-change";
import type { RecordingExampleProps } from "../record-value-change";

const TITLE = "Obligatorio y controlado";

const describePhone = ({ country, number }: PhoneInputValue): string => `${country ?? "sin país"} · ${number || "sin número"}`;

export const ControlledPhoneExample = ({ record }: RecordingExampleProps) => {
  const [phone, setPhone] = useState<PhoneInputValue>({ country: "PE", number: "" });
  const changePhone = (value: PhoneInputValue) => {
    setPhone(value);
    recordValueChange(record, TITLE)(value);
  };
  return (
    <ControlExample title={TITLE}>
      <PhoneInput required value={phone} onValueChange={changePhone} />
      <p className="text-xs text-muted-foreground">Valor actual: {describePhone(phone)}</p>
    </ControlExample>
  );
};
