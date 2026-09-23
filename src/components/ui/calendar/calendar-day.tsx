import * as React from "react";
import type { Day } from "react-day-picker";

import { rangeAttributes } from "./calendar-modifiers";

const CalendarDay = ({
  day,
  modifiers,
  ...tdProps
}: React.ComponentProps<typeof Day>) => {
  void day; // only the modifiers are needed; `day` must not reach the DOM
  return <td {...tdProps} {...rangeAttributes(modifiers)} />;
}

export { CalendarDay };
