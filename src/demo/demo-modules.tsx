import type { ReactNode } from "react";
import { DataTableMock } from "@/components/mocks/table/DataTable.mock";
import { KanbanBoardMock } from "@/components/mocks/kanban/KanbanBoard.mock";
import { AIAssistantIntegratedMock } from "@/components/mocks/ai/AIAssistantIntegrated.mock";
import { AuthFormsMock } from "@/components/mocks/auth/AuthForms.mock";

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
    id: "auth",
    label: "Autenticación",
    content: <AuthFormsMock />,
  },
];
