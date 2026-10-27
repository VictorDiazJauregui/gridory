import { DataTable } from "../../table";
import { buildCompanyColumns } from "../company/company-columns";
import { DemoEventLog } from "../shared/DemoEventLog";
import { useServerTableDemo } from "./use-server-table-demo";

const SERVER_COLUMNS = buildCompanyColumns({ appsWidth: 200, statusSearchable: false }).map((column) => ({
  ...column,
  filterable: false,
  searchable: false,
}));

const EVENT_LOG_DESCRIPTION =
  "La tabla no ordena ni pagina: avisa con onSortChange y onPaginationChange, y el servidor simulado responde en 600 ms.";

type ServerTableDemo = ReturnType<typeof useServerTableDemo>;

const ServerDataTable = ({ demo }: { demo: ServerTableDemo }) => (
  <DataTable
    columns={SERVER_COLUMNS}
    data={demo.result.rows}
    getRowId={(row) => row.id}
    label="empresas"
    features={{ search: false, createButton: false }}
    manualPagination
    manualSorting
    loading={demo.loading}
    serverRowCount={demo.result.total}
    defaultPageSize={demo.page.pageSize}
    pageSizeOptions={[10, 25]}
    sorting={demo.sorting}
    onSortChange={demo.onSortChange}
    onPaginationChange={demo.onPaginationChange}
  />
);

export const ServerTableMock = () => {
  const demo = useServerTableDemo();
  return (
    <section className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-start" aria-label="Servidor simulado">
      <div className="min-w-0 flex-1 space-y-2">
        <h2 className="text-lg font-semibold">Servidor simulado</h2>
        <ServerDataTable demo={demo} />
      </div>
      <DemoEventLog events={demo.events} description={EVENT_LOG_DESCRIPTION} />
    </section>
  );
};
