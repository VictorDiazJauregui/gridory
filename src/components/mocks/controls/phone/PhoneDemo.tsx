import type { RecordingExampleProps } from "../record-value-change";
import { ControlledPhoneExample } from "./ControlledPhoneExample";
import {
  CustomTokensPhoneExample,
  ErrorPhoneExample,
  NarrowPhoneExample,
  StartLabelPhoneExample,
  TopLabelPhoneExample,
} from "./UncontrolledPhoneExamples";

export const PhoneDemo = ({ record }: RecordingExampleProps) => (
  <div className="grid gap-3 lg:grid-cols-2">
    <TopLabelPhoneExample record={record} />
    <StartLabelPhoneExample record={record} />
    <ControlledPhoneExample record={record} />
    <ErrorPhoneExample record={record} />
    <NarrowPhoneExample record={record} />
    <CustomTokensPhoneExample record={record} />
  </div>
);
