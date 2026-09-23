import { useMemo } from "react";
import { ChevronDown, Filter } from "lucide-react";
import "./styles.css";
import { cn } from "../../lib/cn";
import {
  buildDateFilterMenuKey,
  hasColumnFilter,
  pickCalendarSettings,
  resolveEmptyDateState,
} from "../shared/column-filters";
import { resolveRootStyle } from "../shared/root-style";
import { DateFilterMenu, FilterMenu, Toolbar } from "../shared/toolbar";
import { buildArchivedToolbarProps } from "../shared/toolbar/toolbar-props";
import { resolveSortDirection } from "../shared/use-column-sorting";
import { applyBoardDefaults, assertGroupConfiguration } from "./board-view";
import { resolveColumnLabel } from "./group-columns";
import { buildGroupSelectOptions } from "./group-select-options";
import { DefaultKanbanCard } from "./DefaultKanbanCard";
import { KanbanCardMenu } from "./KanbanCardMenu";
import type { KanbanBoardProps } from "./types";
import { useKanbanBoardState } from "./use-kanban-board-state";

export const KanbanBoard = <TData,>(props: KanbanBoardProps<TData>) => {
  assertGroupConfiguration(props.groups, props.defaultGroupId);
  const view = applyBoardDefaults(props);
  const state = useKanbanBoardState(view);
  const {
    fields,
    groups,
    rowActions,
    renderCard,
    onCardClick,
    groupSelectorLabel,
    searchPlaceholder,
    createLabel,
    onCreate,
    emptyMessage,
    boardWrapClassName,
    boardMinHeightClassName,
    columnBodyMaxHeight,
    viewSwitch,
    aiButton,
    toggleGroups,
    headerSelectors,
    toolbarLayout,
    selectTheme,
    thinScrollbars,
    dateFilterRequireOperator,
    flags,
  } = view;
  const {
    search,
    setSearch,
    sorting,
    sortBy,
    toggleColumnSort,
    clearColumnSort,
    filters,
    dateFilters,
    hasActiveFilters,
    setFilter,
    setDateFilter,
    clearFilters,
    openFilterColumnId,
    filterMenuRef,
    toggleFilterMenu,
    closeFilterMenu,
    filterOptions,
    selectedGroup,
    changeGroup,
    visibleCards,
    groupColumns,
    cardsByGroup,
    visibleColumnValues,
    resolveCardId,
    moveCard,
    drag,
  } = state;

  const fieldFilters = useMemo(
    () => fields.filter((field) => field.filterable),
    [fields],
  );

  const emptyDateState = resolveEmptyDateState(dateFilterRequireOperator);

  return (
    <div
      className={cn("gdy-kanban", thinScrollbars && "gdy-thin-scroll")}
      style={resolveRootStyle(view)}
    >
      <div className="gdy-scope gdy-card">
        <Toolbar
          showSearch={flags.search}
          search={search}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={setSearch}
          showClearFilters={flags.filtering && hasActiveFilters}
          onClearFilters={clearFilters}
          groupSelector={
            flags.groupSelector
              ? {
                  options: buildGroupSelectOptions(groups, groupSelectorLabel),
                  value: selectedGroup.id,
                  onChange: changeGroup,
                  ariaLabel: groupSelectorLabel,
                }
              : undefined
          }
          showCreateButton={flags.createButton}
          createLabel={createLabel}
          onCreate={onCreate}
          {...buildArchivedToolbarProps(view, state)}
          viewSwitch={viewSwitch}
          aiButton={aiButton}
          toggleGroups={toggleGroups}
          headerSelectors={headerSelectors}
          toolbarLayout={toolbarLayout}
          selectTheme={selectTheme}
        />

        {flags.filtering && fieldFilters.length > 0 && (
          <div className="gdy-kanban-filter-row">
            {fieldFilters.map((field) => {
              const sortDirection = resolveSortDirection(sorting, field.id);
              const hasFieldFilter = hasColumnFilter(
                field.id,
                filters,
                dateFilters,
              );

              return (
                <div key={field.id} className="gdy-kanban-filter-item">
                  <button
                    type="button"
                    className="gdy-kanban-filter-trigger"
                    data-filtered={hasFieldFilter || undefined}
                    onClick={() => toggleFilterMenu(field.id)}
                  >
                    <span className="gdy-kanban-filter-trigger-label" title={field.header}>
                      {field.header}
                    </span>
                    {hasFieldFilter ? (
                      <Filter size={12} className="gdy-kanban-filter-icon" />
                    ) : null}
                    <ChevronDown size={13} className="gdy-kanban-filter-arrow" />
                  </button>

                  {openFilterColumnId === field.id && (
                    <div className="gdy-kanban-filter-menu-holder" ref={filterMenuRef}>
                      {field.type === "date" ? (
                        <DateFilterMenu
                          key={buildDateFilterMenuKey(field.id, dateFilters[field.id])}
                          state={dateFilters[field.id] ?? emptyDateState}
                          emptyState={emptyDateState}
                          {...pickCalendarSettings(view)}
                          onChange={(next) => setDateFilter(field.id, next)}
                          onClose={closeFilterMenu}
                          sortable={flags.sorting && field.sortable !== false}
                          sortDirection={sortDirection}
                          onSortAsc={() => sortBy(field.id, "asc")}
                          onSortDesc={() => sortBy(field.id, "desc")}
                          onSortClear={() => clearColumnSort(field.id)}
                        />
                      ) : (
                        <FilterMenu
                          options={filterOptions[field.id] ?? []}
                          selected={filters[field.id] ?? []}
                          onSelectedChange={(next) => setFilter(field.id, next)}
                          sortable={flags.sorting && field.sortable !== false}
                          sortDirection={sortDirection}
                          onSortAsc={() => toggleColumnSort(field.id, "asc")}
                          onSortDesc={() => toggleColumnSort(field.id, "desc")}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

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
