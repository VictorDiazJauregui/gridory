import type { ReactNode } from "react";
import { Bot, FileText, KeyRound, PanelLeft, SlidersHorizontal, SquareKanban, Table2 } from "lucide-react";
import { DataTableMock } from "@/components/mocks/table/DataTable.mock";
import { KanbanBoardMock } from "@/components/mocks/kanban/KanbanBoard.mock";
import { AIAssistantIntegratedMock } from "@/components/mocks/ai/AIAssistantIntegrated.mock";
import { AuthFormsMock } from "@/components/mocks/auth/AuthForms.mock";
import { ControlsMock } from "@/components/mocks/controls/Controls.mock";
import { SidebarMock } from "@/components/mocks/sidebar/Sidebar.mock";
import { MarkdownEditorMock } from "@/components/mocks/markdown-editor/MarkdownEditor.mock";

type ModuleItem = {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
};

export const MODULES: ModuleItem[] = [
  {
    id: "table",
    label: "Tabla",
    icon: <Table2 />,
    content: <DataTableMock />,
  },
  {
    id: "kanban",
    label: "Kanban",
    icon: <SquareKanban />,
    content: <KanbanBoardMock />,
  },
  {
    id: "ai",
    label: "Asistente IA",
    icon: <Bot />,
    content: <AIAssistantIntegratedMock />,
  },
  {
    id: "auth",
    label: "Autenticación",
    icon: <KeyRound />,
    content: <AuthFormsMock />,
  },
  {
    id: "controls",
    label: "Controles",
    icon: <SlidersHorizontal />,
    content: <ControlsMock />,
  },
  {
    id: "sidebar",
    label: "Menú lateral",
    icon: <PanelLeft />,
    content: <SidebarMock />,
  },
  {
    id: "markdown-editor",
    label: "Editor Markdown",
    icon: <FileText />,
    content: <MarkdownEditorMock />,
  },
];
