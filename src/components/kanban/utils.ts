import { toComparableDate } from "../shared/date-utils";
import type { SelectOption } from "../shared/toolbar-controls";
import type {
  ArchivedViewMode,
  DateFilterState,
  Primitive,
  ColumnDefinition,
  FilterOption,
  DataInput,
  KanbanGroupOption,
  SortDirection,
} from "./types";

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

export const buildGroupSelectOptions = <TData>(
  groups: KanbanGroupOption<TData>[],
  selectorLabel: string,
): SelectOption[] =>
  groups.map((group) => ({
    value: group.id,
    label: `${selectorLabel}: ${group.label}`,
  }));

export const normalizeToArray = (value: Primitive | Primitive[]): string[] => {
  if (Array.isArray(value))
    return value
      .filter((entry) => entry != null && `${entry}`.trim() !== "")
      .map((entry) => String(entry));

  if (value == null) return [];
  const normalized = String(value).trim();
  return normalized ? [normalized] : [];
};

export const computeColumnFilterOptions = <TData>(
  columns: ColumnDefinition<TData>[],
  rows: TData[],
): Record<string, FilterOption[]> => {
  const map: Record<string, FilterOption[]> = {};

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
  columns: ColumnDefinition<TData>[],
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
  columns: ColumnDefinition<TData>[];
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
  columns: ColumnDefinition<TData>[];
  sorting: { id: string; direction: SortDirection } | null;
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
