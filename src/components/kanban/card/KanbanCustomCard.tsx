import type { ReactNode } from "react";
import type { KanbanCardProps } from "../board/column-settings";
import { KanbanCardMenu } from "./KanbanCardMenu";
import type { CardMoveEntry } from "./move-menu-node";
import type { KanbanCardRenderContext } from "../types";

interface KanbanCustomCardProps<TData> extends KanbanCardProps<TData> {
  renderCard: (
    card: TData,
    context: KanbanCardRenderContext<TData>,
  ) => ReactNode;
  move?: CardMoveEntry;
}

export const KanbanCustomCard = <TData,>(
  props: KanbanCustomCardProps<TData>,
) => {
  const { card, group, groupValue, rowActions, rowActionsEnabled, move } = props;
  return (
    <>
      {props.renderCard(card, { card, groupId: group.id, groupValue })}
      {rowActionsEnabled || move ? (
        <div className="gdy-kanban-card-actions">
          <KanbanCardMenu
            card={card}
            rowActions={rowActionsEnabled ? rowActions : undefined}
            labels={props.labels}
            move={move}
          />
        </div>
      ) : null}
    </>
  );
};
