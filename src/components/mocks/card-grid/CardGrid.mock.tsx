import { useState } from "react";
import { CardGrid } from "../../card-grid";
import { KanbanBoard } from "../../kanban";
import { DataTable } from "../../table";
import { buildCompanyColumns } from "../company/company-columns";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../company/company-rows";
import { KANBAN_STATIC_PROPS } from "../kanban/kanban-config";
import { useSharedViewState } from "./use-shared-view-state";
import { buildViewToggleGroup, type DemoView } from "./view-toggle";

const COLUMNS = buildCompanyColumns({ appsWidth: 180, statusSearchable: true });

const DEMO_DESCRIPTION =
  "Tabla, tarjetas y kanban sobre los mismos datos. La búsqueda, los filtros y el orden viven en la demo y pasan a las tres vistas, así que cambiar de vista no los pierde. Clic en una tarjeta: onRowClick; Ctrl/Cmd + clic: abre su enlace en otra pestaña.";

const useCardGridDemo = () => {
  const [view, setView] = useState<DemoView>("cards");
  const shared = useSharedViewState();
  const common = {
    data: MOCK_COMPANY_ROWS,
    rowActions: KANBAN_STATIC_PROPS.rowActions,
    toggleGroups: [buildViewToggleGroup(view, setView)],
    ...shared,
  };
  return { view, common };
};

const showRow = (row: MockCompanyRow) => window.alert(`Evento onRowClick -> ${row.name}`);

export const CardGridMock = () => {
  const { view, common } = useCardGridDemo();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gdy-muted-foreground">{DEMO_DESCRIPTION}</p>
      {view === "table" && <DataTable {...common} columns={COLUMNS} getRowId={(row) => row.id} defaultPageSize={25} />}
      {view === "cards" && (
        <CardGrid {...common} columns={COLUMNS} getRowId={(row) => row.id} onRowClick={showRow} getRowHref={(row) => `#empresa-${row.id}`} />
      )}
      {view === "kanban" && (
        <KanbanBoard {...common} fields={COLUMNS} groups={KANBAN_STATIC_PROPS.groups} defaultGroupId="status" getCardId={(card) => card.id} />
      )}
    </div>
  );
};
