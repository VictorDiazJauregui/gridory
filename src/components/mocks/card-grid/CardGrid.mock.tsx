import { useState } from "react";
import { CardGrid } from "../../card-grid";
import { KanbanBoard } from "../../kanban";
import { DataTable } from "../../table";
import { buildCompanyColumns } from "../company/company-columns";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../company/company-rows";
import { KANBAN_STATIC_PROPS } from "../kanban/kanban-config";
import { useTextSelectionClickToggle } from "../shared/use-text-selection-click-toggle";
import { useSharedViewState } from "./use-shared-view-state";
import { buildViewToggleGroup, type DemoView } from "./view-toggle";

const COLUMNS = buildCompanyColumns({ appsWidth: 180, statusSearchable: true });

const DEMO_DESCRIPTION =
  "Tabla, tarjetas y kanban sobre los mismos datos. La búsqueda, los filtros y el orden viven en la demo y pasan a las tres vistas, así que cambiar de vista no los pierde. Clic en una tarjeta: onRowClick; Ctrl/Cmd + clic: abre su enlace en otra pestaña. Con «Seleccionar texto no abre», arrastrar sobre el texto de una tarjeta lo marca para copiarlo sin abrirla.";

const useCardGridDemo = () => {
  const [view, setView] = useState<DemoView>("cards");
  const shared = useSharedViewState();
  const textSelectionClick = useTextSelectionClickToggle();
  const common = {
    data: MOCK_COMPANY_ROWS,
    rowActions: KANBAN_STATIC_PROPS.rowActions,
    toggleGroups: [buildViewToggleGroup(view, setView)],
    ...shared,
  };
  const cardProps = { toolbarSlots: [textSelectionClick.slot], ignoreTextSelectionClick: textSelectionClick.enabled };
  return { view, common, cardProps };
};

const showRow = (row: MockCompanyRow) => window.alert(`Evento onRowClick -> ${row.name}`);

export const CardGridMock = () => {
  const { view, common, cardProps } = useCardGridDemo();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gdy-muted-foreground">{DEMO_DESCRIPTION}</p>
      {view === "table" && <DataTable {...common} columns={COLUMNS} getRowId={(row) => row.id} defaultPageSize={25} />}
      {view === "cards" && (
        <CardGrid {...common} {...cardProps} columns={COLUMNS} getRowId={(row) => row.id} onRowClick={showRow} getRowHref={(row) => `#empresa-${row.id}`} />
      )}
      {view === "kanban" && (
        <KanbanBoard {...common} fields={COLUMNS} groups={KANBAN_STATIC_PROPS.groups} defaultGroupId="status" getCardId={(card) => card.id} />
      )}
    </div>
  );
};
