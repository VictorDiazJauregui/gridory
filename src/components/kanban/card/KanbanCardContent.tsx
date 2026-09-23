import type { KanbanCardProps } from "../board/column-settings";
import { DefaultKanbanCard } from "./DefaultKanbanCard";
import { KanbanCustomCard } from "./KanbanCustomCard";

export const KanbanCardContent = <TData,>(props: KanbanCardProps<TData>) => {
  const { renderCard, rowActionsEnabled, rowActions } = props;
  if (renderCard) {
    return <KanbanCustomCard {...props} renderCard={renderCard} />;
  }
  return (
    <DefaultKanbanCard
      card={props.card}
      fields={props.fields}
      group={props.group}
      groupValue={props.groupValue}
      rowActions={rowActionsEnabled ? rowActions : undefined}
    />
  );
};
