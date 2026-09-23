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
    className="gdy-kanban-column-body gdy-scroll"
    style={{ maxHeight: `${props.columnBodyMaxHeight}px` }}
  >
    {props.cards.length === 0 ? (
      <div className="gdy-kanban-empty-col">Sin cards</div>
    ) : (
      renderColumnCards(props)
    )}
  </div>
);
