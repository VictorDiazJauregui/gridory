import { format, parse, isValid } from "date-fns";
import type {
  ArchivedViewMode,
  DateFilterState,
  Primitive,
  ReusableFilterOption,
  ReusableTableInput,
  ReusableColumn,
  ColumnSortingState,
  ReusableGroupHeader,
  ReusableRowGroupingResult,
} from "./types";
import type { DateInputFormat } from "./types";

export const cn = (...values: Array<string | false | null | undefined>) => {
  return values.filter(Boolean).join(" ");
};

export const normalizeInputRows = <TData>(
  input: ReusableTableInput<TData>,
  normalizeRow?: (row: unknown, index: number) => TData,
): TData[] => {
  if (Array.isArray(input)) return input;

  const pool =
    input.data ??
    input.items ??
    input.results ??
    input.records ??
    input.payload?.data ??
    input.payload?.items ??
    input.payload?.results;

  const array = Array.isArray(pool) ? pool : [];
  return normalizeRow
    ? array.map((row, index) => normalizeRow(row, index))
    : (array as TData[]);
};

export const normalizeToArray = (value: Primitive | Primitive[]): string[] => {
  if (Array.isArray(value))
    return value
      .filter((entry) => entry != null && `${entry}`.trim() !== "")
      .map((entry) => String(entry));

  if (value == null) return [];
  const normalized = String(value).trim();
  return normalized ? [normalized] : [];
};

export const toComparableDate = (value: Primitive | Primitive[]): string => {
  const dateRaw = Array.isArray(value) ? value[0] : value;
  if (!dateRaw) return "";
  return String(dateRaw).slice(0, 10);
};

export const hasDateFilterValue = (value?: DateFilterState) => {
  if (!value) return false;
  if (value.op === "gt" || value.op === "lt") return Boolean(value.date);
  return Boolean(value.dateFrom && value.dateTo);
};

/** Maps the user-facing mask (mm = month) to a date-fns pattern (MM = month). */
export const dateFnsPattern = (mask: DateInputFormat): string => mask.replace("mm", "MM");

/** Parses manually typed text under the given mask. Returns undefined if invalid. */
export const parseInputToDate = (text: string, mask: DateInputFormat): Date | undefined => {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  const parsed = parse(trimmed, dateFnsPattern(mask), new Date());
  if (!isValid(parsed)) return undefined;
  return parsed;
};

/** Renders a Date using the given mask (for placeholder-consistent display). */
export const formatDateToInput = (date: Date | undefined, mask: DateInputFormat): string => {
  if (!date) return "";
  return format(date, dateFnsPattern(mask));
};

export const parseStringToDate = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const formatDateToString = (date: Date | undefined): string => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
};

export const computeColumnFilterOptions = <TData>(
  columns: ReusableColumn<TData>[],
  rows: TData[],
): Record<string, ReusableFilterOption[]> => {
  const map: Record<string, ReusableFilterOption[]> = {};

  columns.forEach((column) => {
    if (!column.filterable || column.type === "date") return;
    if (column.filterOptions?.length) {
      map[column.id] = column.filterOptions;
      return;
    }

    const uniqueValues = new Map<string, string>();
    rows.forEach((row) => {
      normalizeToArray(column.accessor(row)).forEach((value) => {
        if (!uniqueValues.has(value)) uniqueValues.set(value, value);
      });
    });

    map[column.id] = Array.from(uniqueValues.entries())
      .map(([value, text]) => ({ value, label: text }))
      .sort((first, second) => first.label.localeCompare(second.label, "es"));
  });

  return map;
};

export const applyGlobalSearch = <TData>(
  rows: TData[],
  columns: ReusableColumn<TData>[],
  query: string,
  enabled: boolean,
) => {
  if (!enabled || !query.trim()) return rows;

  const searchableColumns = columns.filter(
    (column) => column.searchable !== false,
  );
  if (searchableColumns.length === 0) return rows;

  const normalizedQuery = query.trim().toLowerCase();
  return rows.filter((row) =>
    searchableColumns.some((column) =>
      normalizeToArray(column.accessor(row)).some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    ),
  );
};

export const applyArchivedView = <TData>({
  rows,
  mode,
  getIsArchived,
}: {
  rows: TData[];
  mode: ArchivedViewMode;
  getIsArchived?: (row: TData) => boolean;
}) => {
  if (!getIsArchived || mode === "all") return rows;
  return rows.filter((row) => {
    const archived = getIsArchived(row);
    return mode === "archived" ? archived : !archived;
  });
};

export const applyColumnFilters = <TData>({
  rows,
  columns,
  filters,
  dateFilters,
  enabled,
}: {
  rows: TData[];
  columns: ReusableColumn<TData>[];
  filters: Record<string, string[]>;
  dateFilters: Record<string, DateFilterState>;
  enabled: boolean;
}) => {
  if (!enabled) return rows;

  return rows.filter((row) =>
    columns.every((column) => {
      if (!column.filterable) return true;

      if (column.type === "date") {
        const state = dateFilters[column.id];
        if (!state) return true;
        const rowDate = toComparableDate(column.accessor(row));
        if (!rowDate) return false;
        if (state.op === "gt" && state.date) return rowDate > state.date;
        if (state.op === "lt" && state.date) return rowDate < state.date;
        if (state.op === "bt" && state.dateFrom && state.dateTo) {
          return rowDate >= state.dateFrom && rowDate <= state.dateTo;
        }
        return true;
      }

      const selected = filters[column.id] ?? [];
      if (selected.length === 0) return true;
      const values = normalizeToArray(column.accessor(row));
      return selected.some((value) => values.includes(value));
    }),
  );
};

export const applyColumnSorting = <TData>({
  rows,
  columns,
  sorting,
  enabled,
}: {
  rows: TData[];
  columns: ReusableColumn<TData>[];
  sorting: ColumnSortingState | null;
  enabled: boolean;
}) => {
  if (!enabled || !sorting) return rows;

  const activeColumn = columns.find((column) => column.id === sorting.id);
  if (!activeColumn) return rows;

  const direction = sorting.direction === "asc" ? 1 : -1;
  const type = activeColumn.type ?? "text";

  return [...rows].sort((firstRow, secondRow) => {
    const firstValue = activeColumn.accessor(firstRow);
    const secondValue = activeColumn.accessor(secondRow);

    if (type === "number") {
      const firstNumber = Number(
        Array.isArray(firstValue) ? firstValue[0] : firstValue,
      );
      const secondNumber = Number(
        Array.isArray(secondValue) ? secondValue[0] : secondValue,
      );
      return (firstNumber - secondNumber) * direction;
    }

    if (type === "date") {
      const firstDate = toComparableDate(firstValue);
      const secondDate = toComparableDate(secondValue);
      return firstDate.localeCompare(secondDate, "es") * direction;
    }

    const firstText = normalizeToArray(firstValue)[0] ?? "";
    const secondText = normalizeToArray(secondValue)[0] ?? "";
    return (
      firstText.localeCompare(secondText, "es", {
        sensitivity: "base",
        numeric: true,
      }) * direction
    );
  });
};

interface GroupOptionPosition {
  label: string;
  rank: number;
}

// Keys missing from filterOptions share this rank so they fall back to alphabetical order after listed ones.
const UNLISTED_GROUP_RANK = Number.MAX_SAFE_INTEGER;

const indexGroupOptions = (
  options: ReusableFilterOption[] = [],
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

export const applyRowGrouping = <TData>({
  rows,
  columns,
  activeGroupBy,
  emptyLabel,
}: {
  rows: TData[];
  columns: ReusableColumn<TData>[];
  activeGroupBy: string | null;
  emptyLabel: string;
}): ReusableRowGroupingResult<TData> => {
  if (!activeGroupBy) return { flatRows: rows, headers: new Map() };

  const groupColumn = columns.find((column) => column.id === activeGroupBy);
  if (!groupColumn) return { flatRows: rows, headers: new Map() };

  const groups = new Map<string, TData[]>();
  rows.forEach((row) => {
    const key = normalizeToArray(groupColumn.accessor(row))[0] ?? "";
    const bucket = groups.get(key);
    if (bucket) bucket.push(row);
    else groups.set(key, [row]);
  });

  const optionPositions = indexGroupOptions(groupColumn.filterOptions);
  const sortedKeys = Array.from(groups.keys()).sort(
    createGroupKeyComparator(optionPositions),
  );

  const flatRows: TData[] = [];
  const headers = new Map<number, ReusableGroupHeader>();

  sortedKeys.forEach((key) => {
    const bucket = groups.get(key) ?? [];
    headers.set(flatRows.length, {
      value: key,
      label: resolveGroupLabel(key, optionPositions, emptyLabel),
      count: bucket.length,
    });
    bucket.forEach((row) => flatRows.push(row));
  });

  return { flatRows, headers };
};

export const findGroupForIndex = (
  headers: Map<number, ReusableGroupHeader>,
  index: number,
): string | null => {
  let current: string | null = null;
  for (const [start, header] of headers) {
    if (start <= index) current = header.value;
    else break;
  }
  return current;
};
