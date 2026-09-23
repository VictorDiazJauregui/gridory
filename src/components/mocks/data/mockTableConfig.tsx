import { Copy, Download } from "lucide-react";
import type {
  CellHighlight,
  DataTableProps,
  FilterOption,
  MenuItem,
  RowActions,
} from "../../table";
import {
  buildCompanyColumns,
  type MockCompanyColumn,
} from "./mockCompanyColumns";
import type { MockCompanyRow } from "./mockCompanyRows";
import type { MockRowsUpdater } from "./mockRowUpdates";

const TABLE_COLUMN_OPTIONS = { appsWidth: 220, statusSearchable: false };

const STATUS_INLINE_OPTIONS: FilterOption[] = [
  { value: "Activa", label: "Activa" },
  { value: "Archivada", label: "Archivada" },
  { value: "Pendiente", label: "Pendiente" },
];

const STATUS_HIGHLIGHTS: Record<string, CellHighlight> = {
  Activa: {
    style: {
      background: "#dcfce7",
      color: "#166534",
      borderRadius: 6,
      padding: "4px 8px",
    },
  },
  Archivada: {
    style: {
      background: "#e2e8f0",
      color: "#334155",
      borderRadius: 6,
      padding: "4px 8px",
    },
  },
  Pendiente: {
    style: {
      background: "#fef3c7",
      color: "#92400e",
      borderRadius: 6,
      padding: "4px 8px",
    },
  },
};

const withInlineStatus = (
  column: MockCompanyColumn,
  setRows: MockRowsUpdater,
): MockCompanyColumn => ({
  ...column,
  inlineEditOptions: STATUS_INLINE_OPTIONS,
  onInlineEdit: (row, nextValue) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? { ...item, status: nextValue as MockCompanyRow["status"] }
          : item,
      ),
    );
  },
  valueHighlights: STATUS_HIGHLIGHTS,
});

const withFormattedCreatedAt = (
  column: MockCompanyColumn,
): MockCompanyColumn => ({
  ...column,
  cell: (row) => row.createdAt.split("-").reverse().join("/"),
});

export const buildTableColumns = (
  setRows: MockRowsUpdater,
): MockCompanyColumn[] =>
  buildCompanyColumns(TABLE_COLUMN_OPTIONS).map((column) => {
    if (column.id === "status") return withInlineStatus(column, setRows);
    if (column.id === "createdAt") return withFormattedCreatedAt(column);
    return column;
  });

const TABLE_MENU_ACTIONS: MenuItem<MockCompanyRow>[] = [
  { kind: "label", id: "group-quick", label: "Acciones rápidas" },
  {
    id: "duplicate",
    label: "Duplicar",
    icon: <Copy size={16} />,
    onClick: (row) => window.alert(`Duplicar -> ${row.name}`),
  },
  { kind: "separator", id: "sep-main" },
  { kind: "builtin", id: "edit" },
  { kind: "builtin", id: "archive" },
  { kind: "builtin", id: "history" },
  { kind: "separator", id: "sep-danger" },
  { kind: "builtin", id: "remove" },
  {
    id: "export",
    label: "Exportar fila",
    icon: <Download size={16} />,
    onClick: (row) => window.alert(`Exportar -> ${row.name}`),
  },
];

const alertArchiveToggle = (row: MockCompanyRow) => {
  const nextActionLabel =
    row.status === "Archivada" ? "Desarchivar" : "Archivar";
  window.alert(`Evento onArchiveToggle (${nextActionLabel}) -> ${row.name}`);
};

const TABLE_ROW_ACTIONS: RowActions<MockCompanyRow> = {
  getIsArchived: (row) => row.status === "Archivada",
  onEdit: (row) => window.alert(`Evento onEdit -> ${row.name}`),
  onArchiveToggle: alertArchiveToggle,
  onRemove: (row) => window.alert(`Evento onRemove -> ${row.name}`),
  onHistory: (row) => window.alert(`Historial de: ${row.name}`),
  menuActions: TABLE_MENU_ACTIONS,
};

export const TABLE_STATIC_PROPS = {
  getRowId: (row) => row.id,
  label: "empresas",
  createLabel: "Nueva empresa",
  defaultPageSize: 25,
  tableMaxHeightClassName: "gdy-table-max-h-md",
  features: { createButton: true },
  aiButton: { onClick: () => window.alert("Evento aiButton onClick") },
  groupableColumnIds: ["status", "country", "brand"],
  defaultGroupBy: null,
  onGroupChange: (groupBy) => console.log("onGroupChange", groupBy),
  archivedView: {
    defaultValue: "active",
    onChange: (mode) => console.log("onArchivedViewChange (table)", mode),
  },
  rowActions: TABLE_ROW_ACTIONS,
} satisfies Partial<DataTableProps<MockCompanyRow>>;
