import * as React from "react";
import type { Chevron } from "react-day-picker";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

const CalendarChevron = ({
  className,
  orientation,
  ...props
}: React.ComponentProps<typeof Chevron>) => {
  if (orientation === "left") {
    return <ChevronLeftIcon className={className} {...props} />;
  }
  if (orientation === "right") {
    return <ChevronRightIcon className={className} {...props} />;
  }
  return <ChevronDownIcon className={className} {...props} />;
}

export { CalendarChevron };
