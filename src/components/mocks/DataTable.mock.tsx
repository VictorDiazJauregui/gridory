import { useMemo, useState } from "react";
import { CalendarClock, Copy, Download, LayoutList } from "lucide-react";
import { DataTable, type ColumnDefinition, type ViewMode } from "../table";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "./data/mockCompanyRows";

const COUNTRY_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "Chile", label: "Chile" },
  { value: "México", label: "México" },
  { value: "Argentina", label: "Argentina" },
  { value: "Perú", label: "Perú" },
];

export const DataTableMock = () => {
  const [rows, setRows] = useState(MOCK_COMPANY_ROWS);
  const [, setCreatedCount] = useState(1);
  const [view, setView] = useState<ViewMode>("table");
  const [scope, setScope] = useState("all");
  const [country, setCountry] = useState("all");

  const handleCreateRow = () => {
    setCreatedCount((previousCount) => {
      const currentCount = previousCount;
      const next: MockCompanyRow = {
        id: `new-${currentCount}`,
        name: `Empresa nueva ${currentCount}`,
        brand: "Boreal",
        country: "Chile",
        apps: ["CRM"],
        status: "Activa",
        createdAt: "2026-01-01",
      };
      setRows((previousRows) => [next, ...previousRows]);
      return previousCount + 1;
    });
  };

  const columns = useMemo<ColumnDefinition<MockCompanyRow>[]>(
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
        width: 220,
      },
      {
        id: "status",
        header: "Estado",
        accessor: (row) => row.status,
        searchable: false,
        filterable: true,
        sortable: true,
        width: 150,
        inlineEditOptions: [
          { value: "Activa", label: "Activa" },
          { value: "Archivada", label: "Archivada" },
          { value: "Pendiente", label: "Pendiente" },
        ],
        onInlineEdit: (row, nextValue) => {
          setRows((prev) =>
            prev.map((item) =>
              item.id === row.id
                ? { ...item, status: nextValue as MockCompanyRow["status"] }
                : item,
            ),
          );
        },
        valueHighlights: {
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
        },
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
        cell: (row) => row.createdAt.split("-").reverse().join("/"),
      },
    ],
    [],
  );

  const displayedRows = useMemo(() => {
    return rows
      .filter((row) => scope === "all" || row.createdAt.startsWith("2026"))
      .filter((row) => country === "all" || row.country === country);
  }, [rows, scope, country]);

  const handleEdit = (row: MockCompanyRow) => {
    window.alert(`Evento onEdit -> ${row.name}`);
  };

  const handleArchiveToggle = (row: MockCompanyRow) => {
    const nextActionLabel =
      row.status === "Archivada" ? "Desarchivar" : "Archivar";
    window.alert(`Evento onArchiveToggle (${nextActionLabel}) -> ${row.name}`);
  };

  const handleRemove = (row: MockCompanyRow) => {
    window.alert(`Evento onRemove -> ${row.name}`);
  };

  return (
    <DataTable
      columns={columns}
      data={{ results: displayedRows }}
      getRowId={(row) => row.id}
      label="empresas"
      createLabel="Nueva empresa"
      defaultPageSize={25}
      tableMaxHeightClassName="rdt-max-h-md"
      features={{ createButton: true }}
      onCreate={handleCreateRow}
      viewSwitch={{ active: view, onChange: setView }}
      toggleGroups={[
        {
          id: "scope",
          ariaLabel: "Alcance temporal",
          value: scope,
          onChange: setScope,
          options: [
            { value: "all", label: "Todas", icon: <LayoutList size={14} /> },
            {
              value: "recent",
              label: "2026",
              icon: <CalendarClock size={14} />,
            },
          ],
        },
      ]}
      headerSelectors={[
        {
          id: "country",
          label: "País",
          value: country,
          onChange: setCountry,
          options: COUNTRY_OPTIONS,
        },
      ]}
      aiButton={{
        onClick: () => {
          window.alert("Evento aiButton onClick");
        },
      }}
      groupableColumnIds={["status", "country", "brand"]}
      defaultGroupBy={null}
      onGroupChange={(groupBy) => {
        console.log("onGroupChange", groupBy);
      }}
      archivedView={{
        defaultValue: "active",
        onChange: (mode) => {
          console.log("onArchivedViewChange (table)", mode);
        },
      }}
      rowActions={{
        getIsArchived: (row) => row.status === "Archivada",
        onEdit: handleEdit,
        onArchiveToggle: handleArchiveToggle,
        onRemove: handleRemove,
        onHistory: (row) => {
          window.alert(`Historial de: ${row.name}`);
        },
        menuActions: [
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
        ],
      }}
    />
  );
};
