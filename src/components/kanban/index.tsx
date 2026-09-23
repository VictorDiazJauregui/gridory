import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ChevronDown, Filter } from "lucide-react";
import "./styles.css";
import { cn } from "../../lib/cn";
import {
  EMPTY_DATE_FILTER_STATE,
  hasDateFilterValue,
} from "../shared/date-utils";
import { useActiveFilters, useClickOutside } from "../shared/hooks";
import { DateFilterMenu, FilterMenu, Toolbar } from "../shared/toolbar";
import type { DateFilterState, ColumnDefinition } from "./types";
import {
  applyArchivedView,
  applyColumnFilters,
  applyColumnSorting,
  applyGlobalSearch,
  buildGroupSelectOptions,
  computeColumnFilterOptions,
  normalizeInputRows,
  normalizeToArray,
} from "./utils";
import { DEFAULT_KANBAN_FEATURES } from "./constants";
import { DefaultKanbanCard } from "./DefaultKanbanCard";
import { KanbanCardMenu } from "./KanbanCardMenu";
import type {
  ArchivedViewMode,
  KanbanDateFiltersState,
  KanbanFiltersState,
  KanbanSortingState,
  KanbanGroupOption,
  KanbanBoardProps,
} from "./types";

const resolveSortDirection = (
  sorting: KanbanSortingState | null,
  fieldId: string,
): KanbanSortingState["direction"] | null => {
  return sorting?.id === fieldId ? sorting.direction : null;
};

const getGroupValue = <TData,>(
  group: KanbanGroupOption<TData>,
  card: TData,
) => normalizeToArray(group.accessor(card))[0] ?? "";

export const KanbanBoard = <TData,>({
  fields,
  data,
  groups,
  defaultGroupId,
  normalizeRow,
  getCardId,
  features,
  rowActions,
  renderCard,
  onCardMove,
  onCardClick,
  onGroupChange,
  searchPlaceholder = "Buscar cards...",
  createLabel = "Nuevo",
  onCreate,
  emptyMessage = "No se encontraron resultados",
  boardWrapClassName,
  boardMinHeightClassName = "gdy-kanban-min-h-md",
  columnBodyMaxHeight = 480,
  archivedView,
  viewSwitch,
  aiButton,
  toggleGroups,
  headerSelectors,
  toolbarLayout,
  selectTheme,
  thinScrollbars = true,
  scrollbarColor,
  optionHoverColor,
  dateFilterRequireOperator = true,
  dateInputFormat = "dd/mm/yyyy",
  calendarMonthYearDropdown = true,
  calendarFromYear = new Date().getFullYear() - 100,
  calendarToYear = new Date().getFullYear() + 10,
}: KanbanBoardProps<TData>) => {
  if (groups.length === 0) {
    throw new Error(
      "KanbanBoard requiere al menos una configuración de agrupación en `groups`.",
    );
  }

  if (!groups.some((group) => group.id === defaultGroupId)) {
    throw new Error(
      "KanbanBoard requiere que `defaultGroupId` exista dentro de `groups`.",
    );
  }

  const flags = { ...DEFAULT_KANBAN_FEATURES, ...features };

  const inputCards = useMemo(
    () => normalizeInputRows(data, normalizeRow),
    [data, normalizeRow],
  );
  const [cards, setCards] = useState<TData[]>(inputCards);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<KanbanSortingState | null>(null);
  const [filters, setFilters] = useState<KanbanFiltersState>({});
  const [dateFilters, setDateFilters] = useState<KanbanDateFiltersState>({});
  const [openFilterFieldId, setOpenFilterFieldId] = useState<string | null>(
    null,
  );
  const [selectedGroupId, setSelectedGroupId] = useState(defaultGroupId);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dragOverValue, setDragOverValue] = useState<string | null>(null);
  const [internalArchivedMode, setInternalArchivedMode] =
    useState<ArchivedViewMode>(archivedView?.defaultValue ?? "active");
  const archivedMode = archivedView?.value ?? internalArchivedMode;

  const handleArchivedModeChange = (next: ArchivedViewMode) => {
    if (archivedView?.value === undefined) setInternalArchivedMode(next);
    archivedView?.onChange?.(next);
  };

  const filterMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(filterMenuRef, () => setOpenFilterFieldId(null));
  const dragHappenedRef = useRef<boolean>(false);

  useEffect(() => {
    setCards(inputCards);
  }, [inputCards]);

  useEffect(() => {
    if (groups.some((group) => group.id === selectedGroupId)) return;
    setSelectedGroupId(groups[0]?.id ?? "");
  }, [groups, selectedGroupId]);

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? groups[0],
    [groups, selectedGroupId],
  );

  const computedFilterOptions = useMemo(
    () => computeColumnFilterOptions(fields, cards),
    [fields, cards],
  );

  const searchedCards = useMemo(
    () => applyGlobalSearch(cards, fields, search, flags.search),
    [cards, fields, search, flags.search],
  );

  const archivedFilteredCards = useMemo(
    () =>
      archivedView
        ? applyArchivedView({
            rows: searchedCards,
            mode: archivedMode,
            getIsArchived: rowActions?.getIsArchived,
          })
        : searchedCards,
    [searchedCards, archivedMode, archivedView, rowActions],
  );

  const filteredCards = useMemo(
    () =>
      applyColumnFilters({
        rows: archivedFilteredCards,
        columns: fields,
        filters,
        dateFilters: dateFilters as Record<string, DateFilterState>,
        enabled: flags.filtering,
      }),
    [archivedFilteredCards, fields, filters, dateFilters, flags.filtering],
  );

  const sortedCards = useMemo(
    () =>
      applyColumnSorting({
        rows: filteredCards,
        columns: fields,
        sorting: sorting ?? null,
        enabled: flags.sorting,
      }),
    [filteredCards, fields, sorting, flags.sorting],
  );

  const visibleCards = sortedCards;

  const hasActiveFilters = useActiveFilters(
    filters,
    dateFilters as Record<string, DateFilterState>,
  );

  const fieldFilters = useMemo(
    () => fields.filter((field) => field.filterable),
    [fields],
  );

  const groupColumns = useMemo(() => {
    if (!selectedGroup) return [];
    if (selectedGroup.values?.length) return selectedGroup.values;

    const uniqueValues = new Map<string, string>();
    cards.forEach((card) => {
      const value = getGroupValue(selectedGroup, card);
      if (!uniqueValues.has(value))
        uniqueValues.set(value, value || "Sin valor");
    });

    return Array.from(uniqueValues.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((first, second) => first.label.localeCompare(second.label, "es"));
  }, [selectedGroup, cards]);

  const cardsByGroup = useMemo(() => {
    if (!selectedGroup) return {};

    const grouped: Record<string, TData[]> = {};
    groupColumns.forEach((column) => {
      grouped[column.value] = [];
    });

    visibleCards.forEach((card) => {
      const value = getGroupValue(selectedGroup, card);
      if (!grouped[value]) grouped[value] = [];
      grouped[value].push(card);
    });

    return grouped;
  }, [visibleCards, selectedGroup, groupColumns]);

  const visibleColumnValues = useMemo(() => {
    const fromConfig = groupColumns.map((column) => column.value);
    const fromRows = Object.keys(cardsByGroup);
    return Array.from(new Set([...fromConfig, ...fromRows]));
  }, [groupColumns, cardsByGroup]);

  const resolveCardId = (card: TData) => {
    const index = cards.indexOf(card);
    return getCardId(card, index >= 0 ? index : 0);
  };

  const moveCard = (cardId: string, toValue: string) => {
    if (!selectedGroup) return;

    const sourceIndex = cards.findIndex(
      (card, index) => getCardId(card, index) === cardId,
    );
    if (sourceIndex < 0) return;

    const sourceCard = cards[sourceIndex];
    const fromValue = getGroupValue(selectedGroup, sourceCard);
    if (fromValue === toValue) return;

    const updatedCard = selectedGroup.setValue(sourceCard, toValue);
    setCards((previousCards) =>
      previousCards.map((card, index) =>
        getCardId(card, index) === cardId ? updatedCard : card,
      ),
    );

    onCardMove?.({
      card: sourceCard,
      updatedCard,
      cardId,
      groupId: selectedGroup.id,
      fromValue,
      toValue,
    });
  };

  const rootStyle = {
    ...(scrollbarColor ? { ["--gdy-scrollbar-thumb"]: scrollbarColor } : {}),
    ...(optionHoverColor ? { ["--gdy-option-hover-bg"]: optionHoverColor } : {}),
  } as CSSProperties;
  const emptyDateState: DateFilterState = dateFilterRequireOperator
    ? EMPTY_DATE_FILTER_STATE
    : { ...EMPTY_DATE_FILTER_STATE, op: "gt" };

  return (
    <div
      className={cn("gdy-kanban", thinScrollbars && "gdy-thin-scroll")}
      style={rootStyle}
    >
      <div className="gdy-scope gdy-card">
        <Toolbar
          showSearch={flags.search}
          search={search}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={setSearch}
          showClearFilters={flags.filtering && hasActiveFilters}
          onClearFilters={() => {
            setFilters({});
            setDateFilters({});
          }}
          groupSelector={
            flags.groupSelector
              ? {
                  options: buildGroupSelectOptions(groups, "Agrupar por"),
                  value: selectedGroup?.id ?? "",
                  onChange: (groupId) => {
                    setSelectedGroupId(groupId);
                    onGroupChange?.(groupId);
                  },
                  ariaLabel: "Agrupar por",
                }
              : undefined
          }
          showCreateButton={flags.createButton}
          createLabel={createLabel}
          onCreate={onCreate}
          showArchivedView={
            Boolean(archivedView) && Boolean(rowActions?.getIsArchived)
          }
          archivedMode={archivedMode}
          onArchivedModeChange={handleArchivedModeChange}
          archivedViewLabel={archivedView?.label}
          archivedViewOptionLabels={archivedView?.optionLabels}
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
              const hasFieldFilter =
                (filters[field.id]?.length ?? 0) > 0 ||
                hasDateFilterValue(dateFilters[field.id]);

              return (
                <div key={field.id} className="gdy-kanban-filter-item">
                  <button
                    type="button"
                    className="gdy-kanban-filter-trigger"
                    data-filtered={hasFieldFilter || undefined}
                    onClick={() =>
                      setOpenFilterFieldId((previous) =>
                        previous === field.id ? null : field.id,
                      )
                    }
                  >
                    <span className="gdy-kanban-filter-trigger-label" title={field.header}>
                      {field.header}
                    </span>
                    {hasFieldFilter ? <Filter size={12} /> : null}
                    <ChevronDown size={13} />
                  </button>

                  {openFilterFieldId === field.id && (
                    <div className="gdy-kanban-filter-menu-holder" ref={filterMenuRef}>
                      {field.type === "date" ? (
                        <DateFilterMenu
                          key={`${field.id}-${dateFilters[field.id]?.op ?? "gt"}-${dateFilters[field.id]?.date ?? ""}-${dateFilters[field.id]?.dateFrom ?? ""}-${dateFilters[field.id]?.dateTo ?? ""}`}
                          state={dateFilters[field.id] ?? emptyDateState}
                          emptyState={emptyDateState}
                          dateInputFormat={dateInputFormat}
                          calendarMonthYearDropdown={calendarMonthYearDropdown}
                          calendarFromYear={calendarFromYear}
                          calendarToYear={calendarToYear}
                          onChange={(next) =>
                            setDateFilters((previous) => ({
                              ...previous,
                              [field.id]: next,
                            }))
                          }
                          onClose={() => setOpenFilterFieldId(null)}
                          sortable={flags.sorting && field.sortable !== false}
                          sortDirection={sortDirection}
                          onSortAsc={() =>
                            setSorting({
                              id: field.id,
                              direction: "asc",
                            })
                          }
                          onSortDesc={() =>
                            setSorting({
                              id: field.id,
                              direction: "desc",
                            })
                          }
                          onSortClear={() =>
                            setSorting((previous) =>
                              previous?.id === field.id ? null : previous,
                            )
                          }
                        />
                      ) : (
                        <FilterMenu
                          options={computedFilterOptions[field.id] ?? []}
                          selected={filters[field.id] ?? []}
                          onSelectedChange={(next) =>
                            setFilters((previous) => ({
                              ...previous,
                              [field.id]: next,
                            }))
                          }
                          sortable={flags.sorting && field.sortable !== false}
                          sortDirection={sortDirection}
                          onSortAsc={() =>
                            setSorting((previous) =>
                              previous?.id === field.id &&
                              previous.direction === "asc"
                                ? null
                                : { id: field.id, direction: "asc" },
                            )
                          }
                          onSortDesc={() =>
                            setSorting((previous) =>
                              previous?.id === field.id &&
                              previous.direction === "desc"
                                ? null
                                : { id: field.id, direction: "desc" },
                            )
                          }
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
                const configuredLabel = groupColumns.find(
                  (column) => column.value === value,
                )?.label;
                const columnLabel = (configuredLabel ?? value) || "Sin valor";
                const isDropTarget = dragOverValue === value;

                return (
                  <section
                    key={value || "__empty_value__"}
                    className="gdy-kanban-column"
                    data-drop-target={isDropTarget || undefined}
                    onDragOver={(event) => {
                      if (!flags.dragAndDrop) return;
                      event.preventDefault();
                      setDragOverValue(value);
                    }}
                    onDragLeave={() => {
                      if (!flags.dragAndDrop) return;
                      setDragOverValue((previous) =>
                        previous === value ? null : previous,
                      );
                    }}
                    onDrop={() => {
                      if (!flags.dragAndDrop || !draggingCardId) return;
                      moveCard(draggingCardId, value);
                      setDragOverValue(null);
                      setDraggingCardId(null);
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
                          const isDragging = draggingCardId === cardId;

                          return (
                            <article
                              key={cardId}
                              className="gdy-kanban-card"
                              data-dragging={isDragging || undefined}
                              draggable={flags.dragAndDrop}
                              onDragStart={(event) => {
                                if (!flags.dragAndDrop || !selectedGroup)
                                  return;
                                dragHappenedRef.current = true;
                                event.dataTransfer.setData(
                                  "text/plain",
                                  cardId,
                                );
                                event.dataTransfer.effectAllowed = "move";
                                setDraggingCardId(cardId);
                              }}
                              onDragEnd={() => {
                                setDraggingCardId(null);
                                setDragOverValue(null);
                                setTimeout(() => {
                                  dragHappenedRef.current = false;
                                }, 0);
                              }}
                              onClick={() => {
                                if (dragHappenedRef.current) {
                                  dragHappenedRef.current = false;
                                  return;
                                }
                                onCardClick?.({
                                  card,
                                  cardId,
                                  groupId: selectedGroup?.id ?? "",
                                  value,
                                });
                              }}
                            >
                              {renderCard ? (
                                <>
                                  {renderCard(card, {
                                    card,
                                    groupId: selectedGroup?.id ?? "",
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
                                  fields={fields as ColumnDefinition<TData>[]}
                                  group={
                                    selectedGroup ?? {
                                      id: "default",
                                      label: "Grupo",
                                      accessor: () => "",
                                      setValue: (inputCard) => inputCard,
                                    }
                                  }
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
