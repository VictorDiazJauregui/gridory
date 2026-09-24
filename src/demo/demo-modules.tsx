import type { ReactNode } from "react";
import { DataTableMock } from "@/components/mocks/table/DataTable.mock";
import { KanbanBoardMock } from "@/components/mocks/kanban/KanbanBoard.mock";
import { AIAssistantIntegratedMock } from "@/components/mocks/ai/AIAssistantIntegrated.mock";

type ModuleItem = {
  id: string;
  label: string;
  content: ReactNode;
};

export const MODULES: ModuleItem[] = [
  {
    id: "table",
    label: "Tabla",
    content: <DataTableMock />,
  },
  {
    id: "kanban",
    label: "Kanban",
    content: <KanbanBoardMock />,
  },
  {
    id: "ai",
    label: "Asistente IA",
    content: <AIAssistantIntegratedMock />,
  },
  {
    id: "coming-soon",
    label: "Próximo módulo",
    content: (
      <div className="p-6 text-center text-foreground">
        <h2 className="text-xl font-semibold">Próximo módulo</h2>
        <p className="mt-2">En este espacio se agregará más módulos de demo.</p>
      </div>
    ),
  },
];
