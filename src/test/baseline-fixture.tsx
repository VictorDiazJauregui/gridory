import type { ColumnDefinition, RowActions } from "../components/shared/data-model";
import type { HeaderSelectConfig, ToggleGroupConfig } from "../components/shared/toolbar-controls";

export interface BaselineRow {
  id: string;
  name: string;
  country: string;
  status: "Activa" | "Archivada";
}

export const BASELINE_ROWS: BaselineRow[] = [
  { id: "b1", name: "Frío Delta", country: "Perú", status: "Activa" },
  { id: "b2", name: "Pack Norte", country: "Chile", status: "Archivada" },
  { id: "b3", name: "Cold South", country: "México", status: "Activa" },
];

export const BASELINE_COLUMNS: ColumnDefinition<BaselineRow>[] = [
  { id: "name", header: "Empresa", accessor: (row) => row.name, sortable: true, width: 180 },
  { id: "country", header: "País", accessor: (row) => row.country, filterable: true },
  { id: "status", header: "Estado", accessor: (row) => row.status, filterable: true },
];

export const BASELINE_ROW_ACTIONS: RowActions<BaselineRow> = {
  getIsArchived: (row) => row.status === "Archivada",
  onEdit: () => {},
  onArchiveToggle: () => {},
};

const noop = () => {};

export const BASELINE_TOGGLE_GROUP: ToggleGroupConfig = {
  id: "scope",
  ariaLabel: "Alcance",
  value: "all",
  onChange: noop,
  options: [
    { value: "all", label: "Todas" },
    { value: "recent", label: "Recientes" },
  ],
};

export const BASELINE_HEADER_SELECTOR: HeaderSelectConfig = {
  id: "country",
  label: "País",
  value: "all",
  onChange: noop,
  options: [{ value: "all", label: "Todos" }],
};

// Props every baseline view shares: they exercise each built-in toolbar slot.
export const BASELINE_VIEW_PROPS = {
  data: BASELINE_ROWS,
  rowActions: BASELINE_ROW_ACTIONS,
  archivedView: { defaultValue: "all" as const },
  onCreate: noop,
  aiButton: { onClick: noop },
  toggleGroups: [BASELINE_TOGGLE_GROUP],
  headerSelectors: [BASELINE_HEADER_SELECTOR],
};

const ADDED_ATTRIBUTES = / data-(?:column|row)-id="[^"]*"/g;
const ICON = /<svg\b[^>]*>[\s\S]*?<\/svg>/g;
// The table's ⋯ button gains the aria-label the kanban's already had; the kanban's is kept.
const TABLE_ACTIONS_ARIA_LABEL = / aria-label="Opciones"(?=[^>]*><svg class="gdy-table-actions-icon")/g;
const GRIDORY_CLASS = /\bgdy-[a-z0-9-]+/g;

// The inside of an icon belongs to lucide-react, which changes it between the versions the
// dependency range allows: only the gdy-* classes Gridory puts on the icon are compared.
const keepGridoryIconClasses = (icon: string) => {
  const classes = icon.slice(0, icon.indexOf(">")).match(GRIDORY_CLASS) ?? [];
  return `<svg class="${classes.join(" ")}"></svg>`;
};

// 1.1.0 adds data-column-id, data-row-id and the table's ⋯ aria-label on purpose; anything
// else must stay byte for byte.
export const normalizeBaselineHtml = (html: string) =>
  html
    .replace(ADDED_ATTRIBUTES, "")
    .replace(ICON, keepGridoryIconClasses)
    .replace(TABLE_ACTIONS_ARIA_LABEL, "");
