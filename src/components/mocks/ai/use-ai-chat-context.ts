import { useMemo } from "react";
import {
  buildKanbanSystemPrompt,
  buildTableSystemPrompt,
  type AIDataSchema,
} from "../../ai";
import {
  AI_MOCK_FIELDS,
  CUSTOM_PROMPT,
  STATUSES,
  type DemoView,
} from "./ai-config";
import type { MockCompanyRow } from "../company/company-rows";

const toSchemaRow = (row: MockCompanyRow) => ({
  id: row.id,
  name: row.name,
  brand: row.brand,
  country: row.country,
  apps: row.apps,
  status: row.status,
  createdAt: row.createdAt,
});

const buildAiSchema = (rows: MockCompanyRow[]): AIDataSchema => ({
  entityName: "Empresas demo",
  entityNameSingular: "Empresa",
  fields: AI_MOCK_FIELDS,
  rows: rows.map(toSchemaRow),
  kanbanGroupField: "status",
  summary: `Dataset demo de ${rows.length} empresas. Estados válidos: ${STATUSES.join(", ")}.`,
});

const buildSystemPrompt = (dataSchema: AIDataSchema, view: DemoView) =>
  view === "kanban"
    ? buildKanbanSystemPrompt(dataSchema, CUSTOM_PROMPT)
    : buildTableSystemPrompt(dataSchema, CUSTOM_PROMPT);

export const useAiChatContext = (rows: MockCompanyRow[], view: DemoView) => {
  const dataSchema = useMemo(() => buildAiSchema(rows), [rows]);
  const systemPrompt = useMemo(
    () => buildSystemPrompt(dataSchema, view),
    [dataSchema, view],
  );
  return { dataSchema, systemPrompt };
};
