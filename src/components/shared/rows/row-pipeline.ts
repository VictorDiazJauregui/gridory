import type {
  ArchivedViewMode,
  ColumnDefinition,
  ColumnSortingState,
  DataInput,
  DateFilterOp,
  DateFilterState,
  FilterOption,
  Primitive,
} from "../data-model";
import { toComparableDate } from "../controls/date-filter";

type CellValue = Primitive | Primitive[];
type ColumnType = NonNullable<ColumnDefinition<unknown>["type"]>;

export const normalizeInputRows = <TData>(
  input: DataInput<TData>,
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

export const normalizeToArray = (value: CellValue): string[] => {
  if (Array.isArray(value))
    return value
      .filter((entry) => entry != null && `${entry}`.trim() !== "")
      .map((entry) => String(entry));

  if (value == null) return [];
  const normalized = String(value).trim();
  return normalized ? [normalized] : [];
};

const collectUniqueValues = <TData>(
  rows: TData[],
  column: ColumnDefinition<TData>,
): FilterOption[] => {
  const uniqueValues = new Set<string>();
  rows.forEach((row) => {
    normalizeToArray(column.accessor(row)).forEach((value) =>
      uniqueValues.add(value),
    );
  });
  return Array.from(uniqueValues)
    .map((value) => ({ value, label: value }))
    .sort((first, second) => first.label.localeCompare(second.label, "es"));
};

export const computeColumnFilterOptions = <TData>(
  columns: ColumnDefinition<TData>[],
  rows: TData[],
): Record<string, FilterOption[]> => {
  const options: Record<string, FilterOption[]> = {};
  columns.forEach((column) => {
    if (!column.filterable || column.type === "date") return;
    options[column.id] = column.filterOptions?.length
      ? column.filterOptions
      : collectUniqueValues(rows, column);
  });
  return options;
};

interface GlobalSearchInput<TData> {
  rows: TData[];
  columns: ColumnDefinition<TData>[];
  query: string;
}

export const applyGlobalSearch = <TData>({
  rows,
  columns,
  query,
}: GlobalSearchInput<TData>): TData[] => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return rows;

  const searchableColumns = columns.filter(
    (column) => column.searchable !== false,
  );
  if (searchableColumns.length === 0) return rows;

  return rows.filter((row) =>
    searchableColumns.some((column) =>
      normalizeToArray(column.accessor(row)).some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    ),
  );
};

interface ArchivedViewInput<TData> {
  rows: TData[];
  mode: ArchivedViewMode;
  getIsArchived?: (row: TData) => boolean;
}

export const applyArchivedView = <TData>({
  rows,
  mode,
  getIsArchived,
}: ArchivedViewInput<TData>): TData[] => {
  if (!getIsArchived || mode === "all") return rows;
  return rows.filter((row) => {
    const archived = getIsArchived(row);
    return mode === "archived" ? archived : !archived;
  });
};

const DATE_OPERATOR_MATCHERS: Record<
  DateFilterOp,
  (rowDate: string, state: DateFilterState) => boolean
> = {
  gt: (rowDate, state) => !state.date || rowDate > state.date,
  lt: (rowDate, state) => !state.date || rowDate < state.date,
  bt: (rowDate, state) =>
    !state.dateFrom ||
    !state.dateTo ||
    (rowDate >= state.dateFrom && rowDate <= state.dateTo),
};

const matchesDateFilter = <TData>(
  row: TData,
  column: ColumnDefinition<TData>,
  state?: DateFilterState,
): boolean => {
  if (!state) return true;
  const rowDate = toComparableDate(column.accessor(row));
  if (!rowDate) return false;
  if (!state.op) return true;
  return DATE_OPERATOR_MATCHERS[state.op](rowDate, state);
};

const matchesValueFilter = <TData>(
  row: TData,
  column: ColumnDefinition<TData>,
  selected: string[] = [],
): boolean => {
  if (selected.length === 0) return true;
  const values = normalizeToArray(column.accessor(row));
  return selected.some((value) => values.includes(value));
};

interface ActiveFilters {
  filters: Record<string, string[]>;
  dateFilters: Record<string, DateFilterState>;
}

const matchesColumnFilters = <TData>(
  row: TData,
  column: ColumnDefinition<TData>,
  { filters, dateFilters }: ActiveFilters,
): boolean => {
  if (!column.filterable) return true;
  if (column.type === "date")
    return matchesDateFilter(row, column, dateFilters[column.id]);
  return matchesValueFilter(row, column, filters[column.id]);
};

interface ColumnFiltersInput<TData> extends ActiveFilters {
  rows: TData[];
  columns: ColumnDefinition<TData>[];
  enabled: boolean;
}

export const applyColumnFilters = <TData>({
  rows,
  columns,
  enabled,
  ...activeFilters
}: ColumnFiltersInput<TData>): TData[] => {
  if (!enabled) return rows;
  return rows.filter((row) =>
    columns.every((column) => matchesColumnFilters(row, column, activeFilters)),
  );
};

const firstOf = (value: CellValue): Primitive =>
  Array.isArray(value) ? value[0] : value;

const compareNumbers = (first: CellValue, second: CellValue): number =>
  Number(firstOf(first)) - Number(firstOf(second));

const compareDates = (first: CellValue, second: CellValue): number =>
  toComparableDate(first).localeCompare(toComparableDate(second), "es");

const compareText = (first: CellValue, second: CellValue): number =>
  (normalizeToArray(first)[0] ?? "").localeCompare(
    normalizeToArray(second)[0] ?? "",
    "es",
    { sensitivity: "base", numeric: true },
  );

const COMPARATOR_BY_TYPE: Record<
  ColumnType,
  (first: CellValue, second: CellValue) => number
> = {
  number: compareNumbers,
  date: compareDates,
  text: compareText,
};

interface ColumnSortingInput<TData> {
  rows: TData[];
  columns: ColumnDefinition<TData>[];
  sorting: ColumnSortingState | null;
  enabled: boolean;
}

export const applyColumnSorting = <TData>({
  rows,
  columns,
  sorting,
  enabled,
}: ColumnSortingInput<TData>): TData[] => {
  if (!enabled || !sorting) return rows;

  const activeColumn = columns.find((column) => column.id === sorting.id);
  if (!activeColumn) return rows;

  const direction = sorting.direction === "asc" ? 1 : -1;
  const compare = COMPARATOR_BY_TYPE[activeColumn.type ?? "text"];
  return [...rows].sort(
    (firstRow, secondRow) =>
      compare(activeColumn.accessor(firstRow), activeColumn.accessor(secondRow)) *
      direction,
  );
};
