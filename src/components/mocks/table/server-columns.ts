import type { FilterOption } from "../../table";
import { buildCompanyColumns, type MockCompanyColumn } from "../company/company-columns";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../company/company-rows";

// The server filters, so the table only holds one filtered page: the filter menus get every value
// from `filterOptions`, as the docs recommend for manualFiltering.
const SERVER_FILTER_COLUMNS: (keyof MockCompanyRow)[] = ["country", "status"];

const listServerValues = (key: keyof MockCompanyRow): FilterOption[] =>
  [...new Set(MOCK_COMPANY_ROWS.map((row) => String(row[key])))]
    .sort((first, second) => first.localeCompare(second, "es"))
    .map((value) => ({ value, label: value }));

const toServerColumn = (column: MockCompanyColumn): MockCompanyColumn => {
  const key = column.id as keyof MockCompanyRow;
  if (!SERVER_FILTER_COLUMNS.includes(key)) return { ...column, filterable: false, searchable: false };
  return { ...column, searchable: false, filterOptions: listServerValues(key) };
};

export const SERVER_COLUMNS = buildCompanyColumns({ appsWidth: 200, statusSearchable: false }).map(toServerColumn);
