import { ControlledCalendarExample } from "./ControlledCalendarExample";
import type { RecordingExampleProps } from "../record-value-change";
import { CustomTokensExample, IconEndExample, IconsExample, NoAnimationExample } from "./UncontrolledExamples";

export const SegmentedDemo = ({ record }: RecordingExampleProps) => (
  <div className="grid gap-3 lg:grid-cols-2">
    <IconsExample record={record} />
    <ControlledCalendarExample record={record} />
    <IconEndExample record={record} />
    <NoAnimationExample record={record} />
    <CustomTokensExample record={record} />
  </div>
);
