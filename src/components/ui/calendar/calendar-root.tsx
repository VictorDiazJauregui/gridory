import * as React from "react";
import type { Root } from "react-day-picker";

const CalendarRoot = ({
  className,
  rootRef,
  ...props
}: React.ComponentProps<typeof Root>) => (
  <div
    data-slot="calendar"
    ref={rootRef}
    className={className}
    {...props}
  />
);

export { CalendarRoot };
