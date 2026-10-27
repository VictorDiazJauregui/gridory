import { cn } from "../../../lib/cn";
import type { KanbanColumnProps } from "./column-settings";
import { KanbanCard } from "../card/KanbanCard";

const renderColumnCards = <TData,>(props: KanbanColumnProps<TData>) =>
  props.cards.map((card) => {
    const cardId = props.resolveCardId(card);
    return (
      <KanbanCard
        key={cardId}
        {...props.cardSettings}
        card={card}
        cardId={cardId}
        groupValue={props.value}
        drag={props.drag}
      />
    );
  });

export const KanbanColumnBody = <TData,>(props: KanbanColumnProps<TData>) => (
  <div
    className={cn("gdy-kanban-column-body gdy-scroll", props.classNames?.columnBody)}
    style={{ maxHeight: `${props.columnBodyMaxHeight}px` }}
  >
    {props.cards.length === 0 ? (
      <div className="gdy-kanban-empty-col">{props.cardSettings.labels.emptyColumn}</div>
    ) : (
      renderColumnCards(props)
    )}
  </div>
);
