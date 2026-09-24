import { KanbanBoard } from "../../../kanban";
import { AI_KANBAN_GROUPS, AI_MOCK_COLUMNS } from "../ai-config";
import { buildAiRowActions, prependManualRow } from "../ai-row-actions";
import { replaceRow } from "../../company/row-updates";
import type { MockAiRows } from "../use-mock-ai-rows";

type AiDemoKanbanProps = Pick<MockAiRows, "rows" | "setRows">;

export const AiDemoKanban = ({ rows, setRows }: AiDemoKanbanProps) => (
  <KanbanBoard
    fields={AI_MOCK_COLUMNS}
    data={{ results: rows }}
    groups={AI_KANBAN_GROUPS}
    defaultGroupId="status"
    getCardId={(card) => card.id}
    createLabel="Nueva empresa"
    onCreate={() =>
      prependManualRow(setRows, "manual-k", "Empresa manual kanban")
    }
    onCardMove={({ updatedCard }) => replaceRow(setRows, updatedCard)}
    rowActions={buildAiRowActions(setRows)}
  />
);
