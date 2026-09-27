import type { RecordingExampleProps } from "../record-value-change";
import { ControlledCountryExample } from "./ControlledCountryExample";
import {
  DefaultCountryExample,
  MultipleCountryExample,
  NarrowCountryExample,
  WideCountryExample,
} from "./UncontrolledCountryExamples";

export const CountryDemo = ({ record }: RecordingExampleProps) => (
  <div className="grid gap-3 lg:grid-cols-2">
    <DefaultCountryExample record={record} />
    <ControlledCountryExample record={record} />
    <NarrowCountryExample record={record} />
    <WideCountryExample record={record} />
    <MultipleCountryExample record={record} />
  </div>
);
