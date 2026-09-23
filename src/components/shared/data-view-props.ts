import type {
  AiButtonConfig,
  ArchivedViewConfig,
  DateInputFormat,
  RowActions,
  ViewSwitchConfig,
} from "./data-model";
import type { SelectTheme } from "./select-theme";
import type { HeaderSelectConfig, ToggleGroupConfig } from "./toolbar-controls";
import type { ToolbarLayout } from "./toolbar-layout";

export interface DataViewProps<TData> {
  searchPlaceholder?: string;
  createLabel?: string;
  onCreate?: () => void;
  emptyMessage?: string;
  rowActions?: RowActions<TData>;
  archivedView?: ArchivedViewConfig;
  viewSwitch?: ViewSwitchConfig;
  aiButton?: AiButtonConfig;
  /**
   * Custom segmented controls for the toolbar. Each emits its own event; use them
   * to switch datasets/views beyond the table/kanban toggle. By default they sit
   * on the right (before the fixed controls); set each one's `position` to move it.
   */
  toggleGroups?: ToggleGroupConfig[];
  /**
   * Extra generic header selects (besides group-by and archived). Each fires its
   * own `onChange` so the consumer can react over the list. Default `position` is
   * `"right"`.
   */
  headerSelectors?: HeaderSelectConfig[];
  /**
   * Explicit toolbar composition. When provided it is authoritative: only the
   * listed slot ids render, on the given side and order (built-in ids: `search`,
   * `clearFilters`, `archived`, `group`, `ai`, `viewSwitch`, `create`; plus each
   * toggle/selector id). Omit it to keep the default layout, where each control
   * honors its own `position` (default `"right"`).
   */
  toolbarLayout?: ToolbarLayout;
  /** Global styling for every styled select in the component (header + inline). */
  selectTheme?: SelectTheme;
  /**
   * Renders thin, light-gray scrollbars on every internal scroll area
   * (rows/board viewport, option lists, capped-height regions). Cosmetic only.
   * Defaults to `true`.
   */
  thinScrollbars?: boolean;
  /**
   * Thumb color for the thin scrollbars, injected as the
   * `--gdy-scrollbar-thumb` CSS variable. Any CSS color. Defaults to the
   * `--gdy-input` token.
   */
  scrollbarColor?: string;
  /**
   * Hover background for checklist option rows in the value filter menu,
   * injected as the `--gdy-option-hover-bg` CSS variable. Defaults to a
   * subtle tint of the `--gdy-muted` token.
   */
  optionHoverColor?: string;
  /**
   * Requires the user to pick a date operator (greater/less/between) before the
   * calendar input appears; no operator is preselected. Set to `false` to
   * restore the legacy behavior where "greater than" is preselected.
   * Defaults to `true`.
   */
  dateFilterRequireOperator?: boolean;
  /**
   * Mask used by every date filter input for its placeholder, for rendering the
   * selected date, and for parsing manually typed text. Defaults to `"dd/mm/yyyy"`.
   */
  dateInputFormat?: DateInputFormat;
  /**
   * Shows month + year dropdowns in the filter calendar header instead of a
   * static month label, on the same row. Defaults to `true`.
   */
  calendarMonthYearDropdown?: boolean;
  /**
   * First selectable year in the calendar year dropdown.
   * Defaults to the current year minus 100.
   */
  calendarFromYear?: number;
  /**
   * Last selectable year in the calendar year dropdown.
   * Defaults to the current year plus 10.
   */
  calendarToYear?: number;
}
