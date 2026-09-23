import { DataTable } from "../../../table";
import { AI_MOCK_COLUMNS } from "../ai-config";
import { buildAiRowActions, prependManualRow } from "../ai-row-actions";
import type { MockAiRows } from "../use-mock-ai-rows";

type AiDemoTableProps = Pick<MockAiRows, "rows" | "setRows">;

export const AiDemoTable = ({ rows, setRows }: AiDemoTableProps) => (
  <DataTable
    columns={AI_MOCK_COLUMNS}
    data={{ results: rows }}
    getRowId={(row) => row.id}
    label="empresas"
    createLabel="Nueva empresa"
    features={{ createButton: true }}
    onCreate={() => prependManualRow(setRows, "manual", "Empresa manual")}
    rowActions={buildAiRowActions(setRows)}
  />
);
