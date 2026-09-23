import { normalizeToArray } from "../shared/row-pipeline";
import type { SelectOption } from "../shared/toolbar-controls";
import { GROUP_NONE_VALUE } from "./constants";
import type {
  ColumnDefinition,
  FilterOption,
  GroupHeader,
  RowGroupingResult,
} from "./types";

export const buildGroupSelectOptions = (
  groupOptions: Array<{ id: string; label: string }>,
  selectorLabel: string,
  noneLabel: string,
): SelectOption[] => [
  { value: GROUP_NONE_VALUE, label: `${selectorLabel}: ${noneLabel}` },
  ...groupOptions.map((option) => ({
    value: option.id,
    label: `${selectorLabel}: ${option.label}`,
  })),
];

export const resolveGroupOptions = <TData>(
  columns: ColumnDefinition<TData>[],
  groupableColumnIds?: string[],
) =>
  (groupableColumnIds ?? [])
    .map((id) => columns.find((column) => column.id === id))
    .filter((column): column is ColumnDefinition<TData> => Boolean(column))
    .map((column) => ({ id: column.id, label: column.header }));

interface InitialGroupByInput {
  defaultGroupBy: string | null;
  groupableColumnIds?: string[];
}

export const resolveInitialGroupBy = ({
  defaultGroupBy,
  groupableColumnIds,
}: InitialGroupByInput) =>
  defaultGroupBy && (groupableColumnIds ?? []).includes(defaultGroupBy)
    ? defaultGroupBy
    : null;

export const toggleSetMember = (set: Set<string>, value: string) => {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
};

interface GroupOptionPosition {
  label: string;
  rank: number;
}

// Keys missing from filterOptions share this rank so they fall back to alphabetical order after listed ones.
const UNLISTED_GROUP_RANK = Number.MAX_SAFE_INTEGER;

const indexGroupOptions = (
  options: FilterOption[] = [],
): Map<string, GroupOptionPosition> => {
  const positions = new Map<string, GroupOptionPosition>();
  options.forEach(({ value, label }, rank) => {
    if (!positions.has(value)) positions.set(value, { label, rank });
  });
  return positions;
};

const createGroupKeyComparator =
  (optionPositions: Map<string, GroupOptionPosition>) =>
  (first: string, second: string): number => {
    if (first === "" && second !== "") return 1;
    if (second === "" && first !== "") return -1;
    const firstRank = optionPositions.get(first)?.rank ?? UNLISTED_GROUP_RANK;
    const secondRank = optionPositions.get(second)?.rank ?? UNLISTED_GROUP_RANK;
    if (firstRank !== secondRank) return firstRank - secondRank;
    return first.localeCompare(second, "es", { sensitivity: "base" });
  };

const resolveGroupLabel = (
  key: string,
  optionPositions: Map<string, GroupOptionPosition>,
  emptyLabel: string,
): string => {
  if (key === "") return emptyLabel;
  return optionPositions.get(key)?.label ?? key;
};

const groupRowsByKey = <TData>(
  rows: TData[],
  groupColumn: ColumnDefinition<TData>,
) => {
  const groups = new Map<string, TData[]>();
  rows.forEach((row) => {
    const key = normalizeToArray(groupColumn.accessor(row))[0] ?? "";
    const bucket = groups.get(key);
    if (bucket) bucket.push(row);
    else groups.set(key, [row]);
  });
  return groups;
};

const flattenGroups = <TData>(
  groups: Map<string, TData[]>,
  sortedKeys: string[],
  resolveLabel: (key: string) => string,
): RowGroupingResult<TData> => {
  const flatRows: TData[] = [];
  const headers = new Map<number, GroupHeader>();
  sortedKeys.forEach((key) => {
    const bucket = groups.get(key) ?? [];
    headers.set(flatRows.length, {
      value: key,
      label: resolveLabel(key),
      count: bucket.length,
    });
    bucket.forEach((row) => flatRows.push(row));
  });
  return { flatRows, headers };
};

interface RowGroupingInput<TData> {
  rows: TData[];
  columns: ColumnDefinition<TData>[];
  activeGroupBy: string | null;
  emptyLabel: string;
}

export const applyRowGrouping = <TData>({
  rows,
  columns,
  activeGroupBy,
  emptyLabel,
}: RowGroupingInput<TData>): RowGroupingResult<TData> => {
  const groupColumn = activeGroupBy
    ? columns.find((column) => column.id === activeGroupBy)
    : undefined;
  if (!groupColumn) return { flatRows: rows, headers: new Map() };
  const groups = groupRowsByKey(rows, groupColumn);
  const optionPositions = indexGroupOptions(groupColumn.filterOptions);
  const sortedKeys = Array.from(groups.keys()).sort(
    createGroupKeyComparator(optionPositions),
  );
  return flattenGroups(groups, sortedKeys, (key) =>
    resolveGroupLabel(key, optionPositions, emptyLabel),
  );
};

const findGroupForIndex = (
  headers: Map<number, GroupHeader>,
  index: number,
): string | null => {
  let current: string | null = null;
  for (const [start, header] of headers) {
    if (start <= index) current = header.value;
    else break;
  }
  return current;
};

interface RowGroupSelection {
  activeGroupBy: string | null;
  collapsedGroups: Set<string>;
}

export const resolveRowGroupState = (
  headers: Map<number, GroupHeader>,
  { activeGroupBy, collapsedGroups }: RowGroupSelection,
  absoluteIndex: number,
) => {
  const groupHeader = activeGroupBy ? headers.get(absoluteIndex) : undefined;
  const currentGroupValue = activeGroupBy
    ? findGroupForIndex(headers, absoluteIndex)
    : null;
  const isCollapsed =
    currentGroupValue !== null && collapsedGroups.has(currentGroupValue);
  return { groupHeader, isCollapsed };
};
