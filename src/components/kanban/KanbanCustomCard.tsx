import type { ReactNode } from "react";
import type { KanbanCardProps } from "./column-settings";
import { KanbanCardMenu } from "./KanbanCardMenu";
import type { KanbanCardRenderContext } from "./types";

interface KanbanCustomCardProps<TData> extends KanbanCardProps<TData> {
  renderCard: (
    card: TData,
    context: KanbanCardRenderContext<TData>,
  ) => ReactNode;
}

export const KanbanCustomCard = <TData,>(
  props: KanbanCustomCardProps<TData>,
) => {
  const { card, group, groupValue, rowActions } = props;
  return (
    <>
      {props.renderCard(card, { card, groupId: group.id, groupValue })}
      {props.rowActionsEnabled ? (
        <div className="gdy-kanban-card-actions">
          <KanbanCardMenu card={card} rowActions={rowActions} />
        </div>
      ) : null}
    </>
  );
};
