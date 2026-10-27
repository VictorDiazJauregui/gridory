import type { ColumnFiltersState, ManualPaginationState } from "../../table";
import type { ColumnSortingState } from "../../shared/data-model";
import { normalizeSearchText } from "../../shared/text-search/normalize-search-text";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../company/company-rows";

export interface ServerPageRequest extends ManualPaginationState {
  sorting: ColumnSortingState | null;
  filters: ColumnFiltersState;
  search: string;
}

export interface ServerPage {
  rows: MockCompanyRow[];
  total: number;
}

export const SERVER_DELAY_MS = 600;

const sortRows = (rows: MockCompanyRow[], sorting: ColumnSortingState | null) => {
  if (!sorting) return rows;
  const key = sorting.id as keyof MockCompanyRow;
  const factor = sorting.direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => factor * String(a[key]).localeCompare(String(b[key]), "es", { numeric: true }));
};

const filterRows = (rows: MockCompanyRow[], { values }: ColumnFiltersState) =>
  rows.filter((row) =>
    Object.entries(values).every(([id, selected]) => selected.includes(String(row[id as keyof MockCompanyRow]))),
  );

const searchRows = (rows: MockCompanyRow[], search: string) => {
  const query = normalizeSearchText(search);
  if (!query) return rows;
  return rows.filter((row) => normalizeSearchText(`${row.name} ${row.brand}`).includes(query));
};

const buildPage = ({ pageIndex, pageSize, sorting, filters, search }: ServerPageRequest): ServerPage => {
  const matching = sortRows(filterRows(searchRows(MOCK_COMPANY_ROWS, search), filters), sorting);
  const from = pageIndex * pageSize;
  return { rows: matching.slice(from, from + pageSize), total: matching.length };
};

// Stands in for an API: it searches, filters, sorts and slices every company, then answers after a delay.
export const fetchCompanyPage = (request: ServerPageRequest) =>
  new Promise<ServerPage>((resolve) => {
    window.setTimeout(() => resolve(buildPage(request)), SERVER_DELAY_MS);
  });
