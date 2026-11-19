import { Field } from "../shared/field/Field";
import { resolvePhoneFieldNaming } from "./model/field-naming";
import { PhoneInputControl } from "./parts/PhoneInputControl";
import type { PhoneInputProps } from "./types";
import "./styles.css";

export const PhoneInput = (props: PhoneInputProps) => (
  <Field
    {...resolvePhoneFieldNaming(props)}
    id={props.id}
    labelPosition={props.labelPosition}
    required={props.required}
    error={props.error}
  >
    {(control) => <PhoneInputControl settings={props} control={control} name={props.name} />}
  </Field>
);
