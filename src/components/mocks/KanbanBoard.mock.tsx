import { KanbanBoard } from "../kanban";
import { useKanbanMockProps } from "./use-kanban-mock-props";

export const KanbanBoardMock = () => {
  const props = useKanbanMockProps();
  return <KanbanBoard {...props} />;
};
