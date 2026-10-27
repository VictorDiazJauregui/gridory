import type { ManualPaginationState } from "../../table";
import type { ColumnSortingState } from "../../shared/data-model";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../company/company-rows";

export interface ServerPageRequest extends ManualPaginationState {
  sorting: ColumnSortingState | null;
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

const buildPage = ({ pageIndex, pageSize, sorting }: ServerPageRequest): ServerPage => {
  const from = pageIndex * pageSize;
  return { rows: sortRows(MOCK_COMPANY_ROWS, sorting).slice(from, from + pageSize), total: MOCK_COMPANY_ROWS.length };
};

// Stands in for an API: it sorts and slices every company, then answers after a delay.
export const fetchCompanyPage = (request: ServerPageRequest) =>
  new Promise<ServerPage>((resolve) => {
    window.setTimeout(() => resolve(buildPage(request)), SERVER_DELAY_MS);
  });
