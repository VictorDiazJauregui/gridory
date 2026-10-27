import { summarizeCard } from "./card-summary";
import { KanbanCardMenu } from "./KanbanCardMenu";
import type { ColumnDefinition, KanbanBoardLabels, RowActions } from "../types";

interface DefaultKanbanCardHeadProps<TData> {
  card: TData;
  fields: ColumnDefinition<TData>[];
  rowActions?: RowActions<TData>;
  labels: KanbanBoardLabels;
}

export const DefaultKanbanCardHead = <TData,>({
  card,
  fields,
  rowActions,
  labels,
}: DefaultKanbanCardHeadProps<TData>) => {
  const { title, subtitle } = summarizeCard(card, fields, labels.untitledCard);
  return (
    <div className="gdy-kanban-card-head">
      <div className="gdy-kanban-card-main">
        <p className="gdy-kanban-card-title">{title}</p>
        {subtitle ? <p className="gdy-kanban-card-subtitle">{subtitle}</p> : null}
      </div>
      <KanbanCardMenu card={card} rowActions={rowActions} labels={labels} />
    </div>
  );
};
