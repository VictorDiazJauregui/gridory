import { buildColumnHookProps } from "./column-attributes";
import type { KanbanColumnProps } from "./column-settings";
import { buildColumnDropHandlers, buildColumnDropState } from "./drag-handlers";
import { KanbanColumnBody } from "./KanbanColumnBody";
import { KanbanColumnFooter } from "./KanbanColumnFooter";
import { KanbanColumnHead } from "./KanbanColumnHead";

// A collapsed column keeps its drop handlers: the strip still takes dropped cards.
export const KanbanColumn = <TData,>(props: KanbanColumnProps<TData>) => {
  const { value, drag, moveCard, columnHooks, collapse } = props;
  const collapsed = collapse.isCollapsed(value);
  return (
    <section
      {...buildColumnHookProps(value, columnHooks)}
      data-collapsed={collapsed || undefined}
      {...buildColumnDropState(drag, value)}
      {...buildColumnDropHandlers({ drag, value, moveCard })}
    >
      <KanbanColumnHead {...props} collapsed={collapsed} />
      {collapsed ? null : <KanbanColumnBody {...props} />}
      {collapsed ? null : <KanbanColumnFooter {...props} />}
    </section>
  );
};
