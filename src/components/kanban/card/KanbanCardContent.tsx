import type { KanbanCardProps } from "../board/column-settings";
import { DefaultKanbanCard } from "./DefaultKanbanCard";
import { KanbanCustomCard } from "./KanbanCustomCard";
import type { CardMoveEntry } from "./move-menu-node";

const buildCardMoveEntry = <TData,>(props: KanbanCardProps<TData>): CardMoveEntry | undefined => {
  const { moveMenu, cardId, groupValue, pending, labels } = props;
  if (!moveMenu.enabled) return undefined;
  return { moveMenu, cardId, groupValue, pending, label: labels.moveTo };
};

export const KanbanCardContent = <TData,>(props: KanbanCardProps<TData>) => {
  const { renderCard, rowActionsEnabled, rowActions } = props;
  const move = buildCardMoveEntry(props);
  if (renderCard) {
    return <KanbanCustomCard {...props} renderCard={renderCard} move={move} />;
  }
  return (
    <DefaultKanbanCard
      card={props.card}
      fields={props.fields}
      group={props.group}
      groupValue={props.groupValue}
      rowActions={rowActionsEnabled ? rowActions : undefined}
      labels={props.labels}
      move={move}
    />
  );
};
