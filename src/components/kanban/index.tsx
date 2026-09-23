import "./styles.css";
import { cn } from "../../lib/cn";
import { resolveRootStyle } from "../shared/root-style";
import { applyBoardDefaults, assertGroupConfiguration } from "./board-view";
import { resolveColumnLabel } from "./group-columns";
import { DefaultKanbanCard } from "./DefaultKanbanCard";
import { KanbanCardMenu } from "./KanbanCardMenu";
import { KanbanFilterRow } from "./KanbanFilterRow";
import { KanbanToolbar } from "./KanbanToolbar";
import type { KanbanBoardProps } from "./types";
import { useKanbanBoardState } from "./use-kanban-board-state";

export const KanbanBoard = <TData,>(props: KanbanBoardProps<TData>) => {
  assertGroupConfiguration(props.groups, props.defaultGroupId);
  const view = applyBoardDefaults(props);
  const state = useKanbanBoardState(view);
  const {
    fields,
    rowActions,
    renderCard,
    onCardClick,
    emptyMessage,
    boardWrapClassName,
    boardMinHeightClassName,
    columnBodyMaxHeight,
    thinScrollbars,
    flags,
  } = view;
  const {
    selectedGroup,
    visibleCards,
    groupColumns,
    cardsByGroup,
    visibleColumnValues,
    resolveCardId,
    moveCard,
    drag,
  } = state;

  return (
    <div
      className={cn("gdy-kanban", thinScrollbars && "gdy-thin-scroll")}
      style={resolveRootStyle(view)}
    >
      <div className="gdy-scope gdy-card">
        <KanbanToolbar state={state} view={view} />
        <KanbanFilterRow state={state} view={view} />
        <div
          className={cn(
            "gdy-kanban-board-wrap gdy-scroll",
            boardMinHeightClassName,
            boardWrapClassName,
          )}
        >
          {visibleCards.length === 0 ? (
            <div className="gdy-empty">{emptyMessage}</div>
          ) : (
            <div className="gdy-kanban-board">
              {visibleColumnValues.map((value) => {
                const cardsInColumn = cardsByGroup[value] ?? [];
                const columnLabel = resolveColumnLabel(groupColumns, value);
                const isDropTarget = drag.dragOverValue === value;

                return (
                  <section
                    key={value || "__empty_value__"}
                    className="gdy-kanban-column"
                    data-drop-target={isDropTarget || undefined}
                    onDragOver={(event) => {
                      if (!drag.enabled) return;
                      event.preventDefault();
                      drag.setDragOverValue(value);
                    }}
                    onDragLeave={() => {
                      if (!drag.enabled) return;
                      drag.setDragOverValue((previous) =>
                        previous === value ? null : previous,
                      );
                    }}
                    onDrop={() => {
                      if (!drag.enabled || !drag.draggingCardId) return;
                      moveCard(drag.draggingCardId, value);
                      drag.setDragOverValue(null);
                      drag.setDraggingCardId(null);
                    }}
                  >
                    <header className="gdy-kanban-column-head">
                      <span className="gdy-kanban-column-title" title={columnLabel}>
                        {columnLabel}
                      </span>
                      <span className="gdy-kanban-column-count">
                        {cardsInColumn.length}
                      </span>
                    </header>

                    <div
                      className="gdy-kanban-column-body gdy-scroll"
                      style={{ maxHeight: `${columnBodyMaxHeight}px` }}
                    >
                      {cardsInColumn.length === 0 ? (
                        <div className="gdy-kanban-empty-col">Sin cards</div>
                      ) : (
                        cardsInColumn.map((card) => {
                          const cardId = resolveCardId(card);
                          const isDragging = drag.draggingCardId === cardId;

                          return (
                            <article
                              key={cardId}
                              className="gdy-kanban-card"
                              data-dragging={isDragging || undefined}
                              draggable={drag.enabled}
                              onDragStart={(event) => {
                                if (!drag.enabled) return;
                                drag.dragHappenedRef.current = true;
                                event.dataTransfer.setData(
                                  "text/plain",
                                  cardId,
                                );
                                event.dataTransfer.effectAllowed = "move";
                                drag.setDraggingCardId(cardId);
                              }}
                              onDragEnd={() => {
                                drag.setDraggingCardId(null);
                                drag.setDragOverValue(null);
                                setTimeout(() => {
                                  drag.dragHappenedRef.current = false;
                                }, 0);
                              }}
                              onClick={() => {
                                if (drag.dragHappenedRef.current) {
                                  drag.dragHappenedRef.current = false;
                                  return;
                                }
                                onCardClick?.({
                                  card,
                                  cardId,
                                  groupId: selectedGroup.id,
                                  value,
                                });
                              }}
                            >
                              {renderCard ? (
                                <>
                                  {renderCard(card, {
                                    card,
                                    groupId: selectedGroup.id,
                                    groupValue: value,
                                  })}
                                  {flags.rowActions ? (
                                    <div className="gdy-kanban-card-actions">
                                      <KanbanCardMenu
                                        card={card}
                                        rowActions={rowActions}
                                      />
                                    </div>
                                  ) : null}
                                </>
                              ) : (
                                <DefaultKanbanCard
                                  card={card}
                                  fields={fields}
                                  group={selectedGroup}
                                  groupValue={value}
                                  rowActions={
                                    flags.rowActions ? rowActions : undefined
                                  }
                                />
                              )}
                            </article>
                          );
                        })
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export type {
  ArchivedViewConfig,
  ArchivedViewMode,
  ViewMode,
  ViewSwitchConfig,
  AiButtonConfig,
  ColumnDefinition,
  RowActions,
  KanbanBoardFeatures,
  KanbanGroupOption,
  KanbanMoveEvent,
  KanbanCardClickEvent,
  KanbanBoardProps,
  DataInput,
} from "./types";

export type {
  RowAction,
  RowActionPlacement,
  RowActionVariant,
  BuiltInActionId,
  BuiltInMenuRef,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  SelectTheme,
  ToolbarLayout,
  ToolbarSide,
  ToggleDisplay,
  ToggleGroupConfig,
  ToggleOption,
  HeaderSelectConfig,
  SelectOption,
} from "../shared";
