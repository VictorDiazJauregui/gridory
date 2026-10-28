import { buildColumnHookProps } from "./column-attributes";
import type { KanbanColumnProps } from "./column-settings";
import { buildColumnDropHandlers, buildColumnDropState } from "./drag-handlers";
import { KanbanColumnBody } from "./KanbanColumnBody";
import { KanbanColumnHead } from "./KanbanColumnHead";

export const KanbanColumn = <TData,>(props: KanbanColumnProps<TData>) => {
  const { value, drag, moveCard, columnHooks } = props;
  return (
    <section
      {...buildColumnHookProps(value, columnHooks)}
      {...buildColumnDropState(drag, value)}
      {...buildColumnDropHandlers({ drag, value, moveCard })}
    >
      <KanbanColumnHead {...props} />
      <KanbanColumnBody {...props} />
    </section>
  );
};
