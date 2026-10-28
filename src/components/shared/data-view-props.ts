import type { ReactNode } from "react";
import type { Locale } from "date-fns";
import type {
  AiButtonConfig,
  ArchivedViewConfig,
  DateInputFormat,
  RowActions,
  ViewSwitchConfig,
} from "./data-model";
import type { SelectTheme } from "./select-theme";
import type { HeaderSelectConfig, ToggleGroupConfig } from "./toolbar-controls";
import type { ToolbarCustomSlot } from "./toolbar/toolbar-custom-slots";
import type { ToolbarLayout } from "./toolbar/toolbar-layout";

export interface DataViewProps<TData> {
  searchPlaceholder?: string;
  createLabel?: string;
  onCreate?: () => void;
  /**
   * Shown when no row or card matches: text or any node (an icon, a link, a "create the first one" button).
   * Defaults to "No se encontraron resultados"; `null`, `false` or `""` leave the empty state without text.
   */
  emptyMessage?: ReactNode;
  /**
   * Placeholder rows (table) or cards (kanban) replace the data, with `aria-busy="true"` and `data-loading`
   * on the root. The toolbar keeps working and the empty state is never shown. Defaults to `false`.
   */
  loading?: boolean;
  /** Placeholder rows of the table, or placeholder cards per kanban column. Defaults to `5`. */
  loadingRowCount?: number;
  /** Replaces the placeholders with your own content, in the same place. */
  renderLoading?: () => ReactNode;
  rowActions?: RowActions<TData>;
  archivedView?: ArchivedViewConfig;
  viewSwitch?: ViewSwitchConfig;
  aiButton?: AiButtonConfig;
  /**
   * Segmented controls, each emitting its own event (e.g. to switch datasets beyond table/kanban).
   * By default they sit on the right, before the fixed controls; each one's `position` moves it.
   */
  toggleGroups?: ToggleGroupConfig[];
  /**
   * Extra header selects besides group-by and archived, each with its own `onChange`.
   * Default `position` is `"right"`.
   */
  headerSelectors?: HeaderSelectConfig[];
  /**
   * When set, only the listed slot ids render, on the given side and order. Built-in ids: `search`,
   * `clearFilters`, `archived`, `group`, `ai`, `viewSwitch`, `create`, plus each toggle, selector and
   * `toolbarSlots` id. Without it, each control honors its own `position` (default `"right"`).
   */
  toolbarLayout?: ToolbarLayout;
  /**
   * Your own toolbar content, each in `div.gdy-toolbar-slot[data-slot-id]`; without `toolbarLayout` it goes
   * at the end of its `position` side. A repeated or already taken id throws `DuplicateToolbarSlotError`.
   */
  toolbarSlots?: ToolbarCustomSlot[];
  /** Global styling for every styled select in the component (header + inline). */
  selectTheme?: SelectTheme;
  /** Thin, light-gray scrollbars on every internal scroll area. Cosmetic only. Defaults to `true`. */
  thinScrollbars?: boolean;
  /**
   * Thumb color of the thin scrollbars (any CSS color), set as `--gdy-scrollbar-thumb`.
   * Defaults to the `--gdy-input` token.
   */
  scrollbarColor?: string;
  /**
   * Hover background of the option rows in the value filter menu, set as `--gdy-option-hover-bg`.
   * Defaults to a subtle tint of the `--gdy-muted` token.
   */
  optionHoverColor?: string;
  /**
   * The user picks a date operator (greater/less/between) before the calendar input appears. `false`
   * restores the legacy behavior with "greater than" preselected. Defaults to `true`.
   */
  dateFilterRequireOperator?: boolean;
  /**
   * Mask of every date filter input: its placeholder, the selected date and the parsing of typed text.
   * Defaults to `"dd/mm/yyyy"`.
   */
  dateInputFormat?: DateInputFormat;
  /** Month and year dropdowns in the filter calendar header instead of a static label. Defaults to `true`. */
  calendarMonthYearDropdown?: boolean;
  /** First year of the calendar year dropdown. Defaults to the current year minus 100. */
  calendarFromYear?: number;
  /** Last year of the calendar year dropdown. Defaults to the current year plus 10. */
  calendarToYear?: number;
  /**
   * Language of the filter calendar, as a `date-fns` locale (`import { enUS } from "date-fns/locale"`).
   * One from `react-day-picker/locale` also translates its accessible names ("previous month").
   * Defaults to the Spanish `es` of `date-fns`.
   */
  calendarLocale?: Locale;
}
