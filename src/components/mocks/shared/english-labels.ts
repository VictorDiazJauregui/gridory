import type { DataTableLabels } from "../../table/types";
import type { KanbanBoardLabels } from "../../kanban/types";
import type { DataViewLabels } from "../../shared/labels/data-view-labels";

// The demo's own English texts: Gridory only ships Spanish defaults, every app brings its language.
const ENGLISH_VIEW_LABELS: DataViewLabels = {
  searchPlaceholder: "Search...",
  createButton: "New",
  emptyMessage: "No results found",
  groupSelector: "Group by",
  clearFilters: "Clear filters",
  archivedView: "Show",
  archivedActive: "Active",
  archivedArchived: "Archived",
  archivedAll: "All",
  viewSwitchTable: "Table",
  viewSwitchKanban: "Board",
  aiButton: "AI",
  rowActionsTrigger: "Options",
  editAction: "Edit",
  archiveAction: "Archive",
  unarchiveAction: "Unarchive",
  deleteAction: "Delete",
  historyAction: "View history",
  sortTitle: "Sort",
  sortAscending: "Ascending (A → Z)",
  sortDescending: "Descending (Z → A)",
  filterTitle: "Filter",
  selectAll: (count) => (count > 0 ? `Select all (${count})` : "Select all"),
  clearSelection: "Clear",
  filterSearchPlaceholder: "Search...",
  valuesTitle: "Values",
  noResults: "No results",
  dateSortAscending: "Ascending (oldest → newest)",
  dateSortDescending: "Descending (newest → oldest)",
  operatorTitle: "Operator",
  operatorAfter: "After (later date)",
  operatorBefore: "Before (earlier date)",
  operatorBetween: "Between (range)",
  datesTitle: "Dates",
  dateClear: "Clear",
  dateApply: "Apply",
  pickDate: "Pick a date",
  pickRange: "Pick a range",
  labeledValue: (label, value) => `${label}: ${value}`,
};

export const ENGLISH_TABLE_LABELS: DataTableLabels = {
  ...ENGLISH_VIEW_LABELS,
  itemsName: "items",
  showing: ({ from, to, total, itemsName }) =>
    total === 0 ? `0 ${itemsName}` : `Showing ${from}–${to} of ${total} ${itemsName}`,
  pageSize: "Items per page",
  pageOf: (page, count) => `Page ${page} of ${count}`,
  previousPage: "Previous page",
  nextPage: "Next page",
  inlineSelectPlaceholder: "Select...",
  groupNone: "None",
  groupEmptyValue: "No value",
  selectRow: "Select row",
  selectPageRows: "Select the rows of the page",
  selectFilteredRows: "Select every filtered row",
  printSelected: "Yes",
  printNotSelected: "No",
  printSelectionHeader: "Selected",
  columnHelp: (header) => `About ${header}`,
  expandRow: "Show details",
};

const formatUsDate = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split("-");
  return year && month && day ? `${month}/${day}/${year}` : value;
};

export const ENGLISH_KANBAN_LABELS: KanbanBoardLabels = {
  ...ENGLISH_VIEW_LABELS,
  searchPlaceholder: "Search cards...",
  emptyColumn: "No cards",
  emptyValue: "No value",
  untitledCard: "Untitled",
  cardFieldLabel: (header) => `${header}:`,
  formatCardDate: formatUsDate,
  moveTo: "Move to…",
  cardMovedTo: (column) => `Card moved to ${column}`,
  cardMoveReverted: (column) => `The card went back to ${column}`,
  collapseColumn: (column) => `Collapse ${column}`,
  expandColumn: (column) => `Expand ${column}`,
};
