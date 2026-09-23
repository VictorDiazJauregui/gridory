import { buildColumnSettings } from "./column-settings";
import { resolveColumnLabel } from "./group-columns";
import { KanbanColumn } from "./KanbanColumn";
import type { KanbanSectionProps } from "./use-kanban-board-state";

export const KanbanColumns = <TData,>({
  state,
  view,
}: KanbanSectionProps<TData>) => {
  const settings = buildColumnSettings(state, view);
  return (
    <div className="gdy-kanban-board">
      {state.visibleColumnValues.map((value) => (
        <KanbanColumn
          key={value || "__empty_value__"}
          {...settings}
          value={value}
          label={resolveColumnLabel(state.groupColumns, value)}
          cards={state.cardsByGroup[value] ?? []}
        />
      ))}
    </div>
  );
};
