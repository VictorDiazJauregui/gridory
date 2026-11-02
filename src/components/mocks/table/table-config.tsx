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
} from "../company/company-columns";
import type { MockCompanyRow } from "../company/company-rows";
import type { MockRowsUpdater } from "../company/row-updates";
import { buildAmountColumn } from "./company-amounts";
import { AmountFooter, TotalLabelFooter } from "./AmountFooter";
import { buildNotesColumn } from "./company-notes";
import { withResponsiveFields } from "./use-column-visibility-demo";
import { withHeaderHelp } from "./header-help-columns";

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

const decorateColumn = (column: MockCompanyColumn, setRows: MockRowsUpdater) => {
  if (column.id === "status") return withInlineStatus(column, setRows);
  if (column.id === "createdAt") return withFormattedCreatedAt(column);
  return column;
};

const insertColumnAfter = (columns: MockCompanyColumn[], previousId: string, column: MockCompanyColumn) => {
  const position = columns.findIndex((item) => item.id === previousId) + 1;
  return [...columns.slice(0, position), column, ...columns.slice(position)];
};

const insertNewColumns = (columns: MockCompanyColumn[]) =>
  insertColumnAfter(insertColumnAfter(columns, "country", buildAmountColumn()), "apps", buildNotesColumn());

// The totals row (1.2.0): the label under the company and the amounts under their column.
const withTotalsFooter = (column: MockCompanyColumn): MockCompanyColumn => {
  if (column.id === "name") return { ...column, footer: TotalLabelFooter };
  if (column.id === "amount") return { ...column, footer: AmountFooter };
  return column;
};

// The inline status select is a control of its own: clicking it must not open the row. On paper (1.4.0) the
// select means nothing, so the column prints its value as text.
const ignoreStatusClicks = (columns: MockCompanyColumn[]) =>
  columns.map((column) =>
    column.id === "status" ? { ...column, ignoreRowClick: true, printValue: (row: MockCompanyRow) => row.status } : column,
  );

export const buildTableColumns = (
  setRows: MockRowsUpdater,
  withNewProps: boolean,
): MockCompanyColumn[] => {
  const columns = buildCompanyColumns(TABLE_COLUMN_OPTIONS).map((column) =>
    decorateColumn(column, setRows),
  );
  if (!withNewProps) return columns;
  return withHeaderHelp(withResponsiveFields(ignoreStatusClicks(insertNewColumns(columns)).map(withTotalsFooter)));
};

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

export const TABLE_ROW_ACTIONS: RowActions<MockCompanyRow> = {
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
  archivedView: { defaultValue: "active" },
  rowActions: TABLE_ROW_ACTIONS,
} satisfies Partial<DataTableProps<MockCompanyRow>>;
