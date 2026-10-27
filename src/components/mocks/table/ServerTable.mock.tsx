import { useState } from "react";
import { DataTable, type DataTableProps } from "../../table";
import type { MockCompanyRow } from "../company/company-rows";
import { DemoEventLog } from "../shared/DemoEventLog";
import { useDemoText } from "../shared/demo-dictionary";
import { useDemoLanguage } from "../shared/demo-language";
import { localizeTableDemoProps } from "../shared/localize-demo-props";
import { SERVER_COLUMNS } from "./server-columns";
import { AutoRowsToggle, FirstPageButton } from "./ServerToolbarButtons";
import { usePageSizeByHeight } from "./use-page-size-by-height";
import { useServerTableDemo } from "./use-server-table-demo";

const EVENT_LOG_DESCRIPTION = {
  es: "La tabla no busca, no ordena, no filtra ni pagina: avisa con onSearchChange (300 ms después de dejar de escribir), onSortChange, onFiltersChange y onPaginationChange, y el servidor simulado responde en 600 ms.",
  en: "The table does not search, sort, filter or page: it reports onSearchChange (300 ms after typing stops), onSortChange, onFiltersChange and onPaginationChange, and the simulated server answers in 600 ms.",
};

type ServerTableDemo = ReturnType<typeof useServerTableDemo>;

interface AutoRows {
  active: boolean;
  toggle: () => void;
}

const buildServerToolbarSlots = (demo: ServerTableDemo, autoRows: AutoRows) => [
  { id: "first-page", position: "left" as const, content: <FirstPageButton onClick={demo.goToFirstPage} /> },
  { id: "auto-rows", position: "left" as const, content: <AutoRowsToggle active={autoRows.active} onToggle={autoRows.toggle} /> },
];

const buildServerDataProps = (demo: ServerTableDemo, autoRows: AutoRows): DataTableProps<MockCompanyRow> => ({
  columns: SERVER_COLUMNS,
  data: demo.result.rows,
  getRowId: (row) => row.id,
  label: "empresas",
  features: { createButton: false },
  loading: demo.loading,
  serverRowCount: demo.result.total,
  pageSizeOptions: [10, 25],
  toolbarSlots: buildServerToolbarSlots(demo, autoRows),
  fillHeight: autoRows.active,
});

// Everything the server resolves: the table only reports it, and the demo owns every value.
const buildServerControlProps = (demo: ServerTableDemo): Partial<DataTableProps<MockCompanyRow>> => ({
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
  searchDebounceMs: 300,
  search: demo.request.search,
  onSearchChange: demo.onSearchChange,
  sorting: demo.request.sorting,
  onSortChange: demo.onSortChange,
  columnFilters: demo.request.filters,
  onFiltersChange: demo.onFiltersChange,
  pageIndex: demo.request.pageIndex,
  pageSize: demo.request.pageSize,
  onPaginationChange: demo.onPaginationChange,
});

const useAutoRows = (container: HTMLDivElement | null) => {
  const [active, setActive] = useState(false);
  const measured = usePageSizeByHeight(active ? container : null);
  return { active, toggle: () => setActive((current) => !current), measured: active ? measured : null };
};

export const ServerTableMock = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const autoRows = useAutoRows(container);
  const demo = useServerTableDemo(autoRows.measured);
  const language = useDemoLanguage();
  const title = useDemoText()("Servidor simulado");
  const tableProps = localizeTableDemoProps({ ...buildServerDataProps(demo, autoRows), ...buildServerControlProps(demo) }, language);
  return (
    <section className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-start" aria-label={title}>
      <div className="min-w-0 flex-1 space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div ref={setContainer} className={autoRows.active ? "h-[60vh]" : undefined}>
          <DataTable {...tableProps} />
        </div>
      </div>
      <DemoEventLog events={demo.events} description={EVENT_LOG_DESCRIPTION[language]} />
    </section>
  );
};
