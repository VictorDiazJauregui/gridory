import { useMemo, useState } from "react";
import type { KanbanColumnFooterContext } from "../../kanban";
import { normalizeToArray } from "../../shared/rows/row-pipeline";
import type { MockCompanyRow } from "../company/company-rows";
import { ColumnLoadMore } from "./ColumnLoadMore";
import { KANBAN_STATIC_PROPS } from "./kanban-config";

const PAGE_SIZE = 10;

type ColumnCounts = Record<string, number>;

const findGroup = (groupId: string) =>
  KANBAN_STATIC_PROPS.groups.find((group) => group.id === groupId) ?? KANBAN_STATIC_PROPS.groups[0];

const countByColumn = (cards: MockCompanyRow[], columnOf: (card: MockCompanyRow) => string) =>
  cards.reduce<ColumnCounts>((counts, card) => ({ ...counts, [columnOf(card)]: (counts[columnOf(card)] ?? 0) + 1 }), {});

const columnKey = (groupId: string, value: string) => `${groupId}:${value}`;

const columnOfGroup = (groupId: string) => (card: MockCompanyRow) =>
  normalizeToArray(findGroup(groupId).accessor(card))[0] ?? "";

const limitIn = (limits: ColumnCounts, groupId: string) => (value: string) =>
  limits[columnKey(groupId, value)] ?? PAGE_SIZE;

interface PageRequest {
  cards: MockCompanyRow[];
  groupId: string;
  limits: ColumnCounts;
  movedIds: ReadonlySet<string>;
}

// Like a server that pages each column: the board gets only the first cards of every column, plus the
// ones the user moved there, which a real app already holds.
const pageColumns = ({ cards, groupId, limits, movedIds }: PageRequest) => {
  const columnOf = columnOfGroup(groupId);
  const limitOf = limitIn(limits, groupId);
  const taken: ColumnCounts = {};
  return cards.filter((card) => {
    if (movedIds.has(card.id)) return true;
    const value = columnOf(card);
    taken[value] = (taken[value] ?? 0) + 1;
    return taken[value] <= limitOf(value);
  });
};

/** The demo's "Load more" per column: the app pages, the board only shows the footer. */
export const useColumnPaging = (cards: MockCompanyRow[]) => {
  const [groupId, setGroupId] = useState(KANBAN_STATIC_PROPS.defaultGroupId);
  const [limits, setLimits] = useState<ColumnCounts>({});
  const [movedIds, setMovedIds] = useState<ReadonlySet<string>>(() => new Set());
  // Memoized, as the full data is: a new reference would count as new data in the middle of a move.
  const pagedData = useMemo(
    () => ({ results: pageColumns({ cards, groupId, limits, movedIds }) }),
    [cards, groupId, limits, movedIds],
  );
  const columnOf = columnOfGroup(groupId);
  const footer = { loaded: countByColumn(pagedData.results, columnOf), totals: countByColumn(cards, columnOf) };
  const loadMore = (value: string) =>
    setLimits((current) => ({ ...current, [columnKey(groupId, value)]: limitIn(current, groupId)(value) + PAGE_SIZE }));
  const renderColumnFooter = ({ value }: KanbanColumnFooterContext<MockCompanyRow>) => (
    <ColumnLoadMore loaded={footer.loaded[value] ?? 0} total={footer.totals[value] ?? 0} onLoadMore={() => loadMore(value)} />
  );
  const keepMoved = (cardId: string) => setMovedIds((current) => new Set(current).add(cardId));
  return { pagedData, onGroupChange: setGroupId, renderColumnFooter, keepMoved };
};
