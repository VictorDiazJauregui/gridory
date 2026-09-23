import { useMemo, useState } from "react";
import { CalendarClock, Copy, Download, LayoutList, Share2 } from "lucide-react";
import {
  KanbanBoard,
  type ColumnDefinition,
  type KanbanGroupOption,
  type ViewMode,
} from "../kanban";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "./data/mockCompanyRows";

const BRAND_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "Boreal", label: "Boreal" },
  { value: "Glacial", label: "Glacial" },
  { value: "Arctic", label: "Arctic" },
];

export const KanbanBoardMock = () => {
  const [cards, setCards] = useState(MOCK_COMPANY_ROWS);
  const [, setCreatedCount] = useState(1);
  const [view, setView] = useState<ViewMode>("kanban");
  const [scope, setScope] = useState("all");
  const [brand, setBrand] = useState("all");

  const fields = useMemo<ColumnDefinition<MockCompanyRow>[]>(
    () => [
      {
        id: "name",
        header: "Empresa",
        accessor: (row) => row.name,
        searchable: true,
        filterable: true,
        sortable: true,
        width: 220,
      },
      {
        id: "brand",
        header: "Marca",
        accessor: (row) => row.brand,
        searchable: true,
        filterable: true,
        sortable: true,
        width: 130,
      },
      {
        id: "country",
        header: "País",
        accessor: (row) => row.country,
        searchable: true,
        filterable: true,
        sortable: true,
        width: 130,
      },
      {
        id: "apps",
        header: "Apps",
        accessor: (row) => row.apps,
        searchable: true,
        filterable: true,
        sortable: false,
        width: 180,
      },
      {
        id: "status",
        header: "Estado",
        accessor: (row) => row.status,
        searchable: true,
        filterable: true,
        sortable: true,
        width: 150,
      },
      {
        id: "createdAt",
        header: "Alta",
        accessor: (row) => row.createdAt,
        type: "date",
        searchable: false,
        filterable: true,
        sortable: true,
        width: 120,
      },
    ],
    [],
  );

  const groups = useMemo<KanbanGroupOption<MockCompanyRow>[]>(
    () => [
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
    ],
    [],
  );

  const handleCreate = () => {
    setCreatedCount((previousCount) => {
      const nextCount = previousCount + 1;
      const nextCard: MockCompanyRow = {
        id: `kanban-new-${previousCount}`,
        name: `Empresa Kanban ${previousCount}`,
        brand: "Boreal",
        country: "Chile",
        apps: ["CRM"],
        status: "Pendiente",
        createdAt: "2026-01-01",
      };
      setCards((previousCards) => [nextCard, ...previousCards]);
      return nextCount;
    });
  };

  const displayedCards = useMemo(() => {
    return cards
      .filter((card) => scope === "all" || card.createdAt.startsWith("2026"))
      .filter((card) => brand === "all" || card.brand === brand);
  }, [cards, scope, brand]);

  return (
    <KanbanBoard
      fields={fields}
      data={{ results: displayedCards }}
      groups={groups}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      createLabel="Nueva empresa"
      boardMinHeightClassName="gdy-kanban-min-h-lg"
      viewSwitch={{ active: view, onChange: setView }}
      toggleGroups={[
        {
          id: "scope",
          ariaLabel: "Alcance temporal",
          value: scope,
          onChange: setScope,
          options: [
            { value: "all", label: "Todas", icon: <LayoutList size={14} /> },
            { value: "recent", label: "2026", icon: <CalendarClock size={14} /> },
          ],
        },
      ]}
      headerSelectors={[
        {
          id: "brand",
          label: "Marca",
          value: brand,
          onChange: setBrand,
          options: BRAND_OPTIONS,
        },
      ]}
      toolbarLayout={{
        left: ["scope", "search", "clearFilters"],
        right: ["brand", "archived", "group", "ai", "viewSwitch", "create"],
      }}
      aiButton={{
        onClick: () => window.alert("Evento aiButton -> abrir asistente IA"),
      }}
      onCreate={handleCreate}
      onCardMove={({ updatedCard }) => {
        setCards((previousCards) =>
          previousCards.map((item) =>
            item.id === updatedCard.id ? updatedCard : item,
          ),
        );
      }}
      archivedView={{
        defaultValue: "active",
        onChange: (mode) => {
          console.log("onArchivedViewChange (kanban)", mode);
        },
      }}
      rowActions={{
        getIsArchived: (row) => row.status === "Archivada",
        onEdit: (row) => window.alert(`Evento onEdit -> ${row.name}`),
        onArchiveToggle: (row) =>
          window.alert(`Evento onArchiveToggle -> ${row.name}`),
        onRemove: (row) => window.alert(`Evento onRemove -> ${row.name}`),
        onHistory: (row) => window.alert(`Evento onHistory -> ${row.name}`),
        customActions: [
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
        ],
      }}
    />
  );
};
