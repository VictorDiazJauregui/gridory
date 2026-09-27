import { useState } from "react";
import { SegmentedControl } from "../../../segmented-control";
import { recordValueChange } from "../record-value-change";
import type { RecordingExampleProps } from "../record-value-change";
import { ControlExample } from "../ControlExample";
import { CALENDAR_VIEW_OPTIONS } from "./segmented-options";

const TITLE = "Sin iconos (controlado)";

const findCalendarViewLabel = (value: string) =>
  CALENDAR_VIEW_OPTIONS.find((option) => option.value === value)?.label;

export const ControlledCalendarExample = ({ record }: RecordingExampleProps) => {
  const [view, setView] = useState("month");
  const changeView = (value: string) => {
    setView(value);
    recordValueChange(record, TITLE)(value);
  };
  return (
    <ControlExample title={TITLE}>
      <SegmentedControl options={CALENDAR_VIEW_OPTIONS} value={view} onValueChange={changeView} aria-label="Vista del calendario" />
      <p className="text-xs text-muted-foreground">Valor actual: {findCalendarViewLabel(view)}</p>
    </ControlExample>
  );
};
