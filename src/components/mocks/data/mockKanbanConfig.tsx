import { Copy, Download, Share2 } from "lucide-react";
import type {
  KanbanBoardProps,
  KanbanGroupOption,
  RowAction,
  RowActions,
} from "../../kanban";
import { buildCompanyColumns } from "./mockCompanyColumns";
import type { MockCompanyRow } from "./mockCompanyRows";

const KANBAN_GROUPS: KanbanGroupOption<MockCompanyRow>[] = [
  {
    id: "status",
    label: "Estado",
    accessor: (card) => card.status,
    setValue: (card, nextValue) => ({
      ...card,
      status: nextValue as MockCompanyRow["status"],
    }),
    values: [
      { value: "Activa", label: "Activa" },
      { value: "Pendiente", label: "Pendiente" },
      { value: "Archivada", label: "Archivada" },
    ],
  },
  {
    id: "country",
    label: "País",
    accessor: (card) => card.country,
    setValue: (card, nextValue) => ({ ...card, country: nextValue }),
  },
  {
    id: "brand",
    label: "Marca",
    accessor: (card) => card.brand,
    setValue: (card, nextValue) => ({ ...card, brand: nextValue }),
  },
];

const KANBAN_CUSTOM_ACTIONS: RowAction<MockCompanyRow>[] = [
  {
    id: "duplicate",
    label: "Duplicar",
    icon: <Copy size={16} />,
    placement: "top",
    onClick: (row) => window.alert(`Duplicar -> ${row.name}`),
  },
  {
    id: "export",
    label: "Exportar tarjeta",
    icon: <Download size={16} />,
    onClick: (row) => window.alert(`Exportar -> ${row.name}`),
  },
  {
    id: "share",
    label: "Compartir",
    icon: <Share2 size={16} />,
    disabled: (row) => row.status === "Archivada",
    onClick: (row) => window.alert(`Compartir -> ${row.name}`),
  },
];

const KANBAN_ROW_ACTIONS: RowActions<MockCompanyRow> = {
  getIsArchived: (row) => row.status === "Archivada",
  onEdit: (row) => window.alert(`Evento onEdit -> ${row.name}`),
  onArchiveToggle: (row) =>
    window.alert(`Evento onArchiveToggle -> ${row.name}`),
  onRemove: (row) => window.alert(`Evento onRemove -> ${row.name}`),
  onHistory: (row) => window.alert(`Evento onHistory -> ${row.name}`),
  customActions: KANBAN_CUSTOM_ACTIONS,
};

export const KANBAN_STATIC_PROPS = {
  fields: buildCompanyColumns({ appsWidth: 180, statusSearchable: true }),
  groups: KANBAN_GROUPS,
  defaultGroupId: "status",
  getCardId: (card) => card.id,
  createLabel: "Nueva empresa",
  boardMinHeightClassName: "gdy-kanban-min-h-lg",
  toolbarLayout: {
    left: ["scope", "search", "clearFilters"],
    right: ["brand", "archived", "group", "ai", "viewSwitch", "create"],
  },
  aiButton: {
    onClick: () => window.alert("Evento aiButton -> abrir asistente IA"),
  },
  archivedView: {
    defaultValue: "active",
    onChange: (mode) => console.log("onArchivedViewChange (kanban)", mode),
  },
  rowActions: KANBAN_ROW_ACTIONS,
} satisfies Partial<KanbanBoardProps<MockCompanyRow>>;
