import type {
  DateFilterState,
  DateInputFormat,
  SortDirection,
} from "../data-model";
import { EMPTY_DATE_FILTER_STATE } from "../date-filter";
import {
  applyPropDefaults,
  resolveCalendarYearDefaults,
} from "../prop-defaults";

export interface DateFilterMenuProps {
  state: DateFilterState;
  onChange: (next: DateFilterState) => void;
  onClose: () => void;
  sortable?: boolean;
  sortDirection?: SortDirection | null;
  onSortAsc?: () => void;
  onSortDesc?: () => void;
  onSortClear?: () => void;
  dateInputFormat: DateInputFormat;
  calendarMonthYearDropdown: boolean;
  calendarFromYear: number;
  calendarToYear: number;
  emptyState?: DateFilterState;
}

interface DateFilterMenuDefaults {
  sortable: boolean;
  sortDirection: SortDirection | null;
  dateInputFormat: DateInputFormat;
  calendarMonthYearDropdown: boolean;
  calendarFromYear: number;
  calendarToYear: number;
  emptyState: DateFilterState;
}

export type DateFilterMenuSettings = DateFilterMenuProps &
  DateFilterMenuDefaults;

// The year bounds follow the current date, so they are rebuilt per render.
const buildDateFilterMenuDefaults = (): DateFilterMenuDefaults => ({
  sortable: false,
  sortDirection: null,
  dateInputFormat: "dd/mm/yyyy",
  calendarMonthYearDropdown: true,
  ...resolveCalendarYearDefaults(),
  emptyState: EMPTY_DATE_FILTER_STATE,
});

export const resolveDateFilterMenuSettings = (
  props: DateFilterMenuProps,
): DateFilterMenuSettings =>
  applyPropDefaults(buildDateFilterMenuDefaults(), props);
