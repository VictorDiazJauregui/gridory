import type { ColumnDefinition } from "../../table";
import type { MockCompanyRow } from "./company-rows";

export type MockCompanyColumn = ColumnDefinition<MockCompanyRow>;

export interface CompanyColumnOptions {
  appsWidth: number;
  statusSearchable: boolean;
}

type TextColumnId = "name" | "brand" | "country";

const buildTextColumn = (
  id: TextColumnId,
  header: string,
  width: number,
): MockCompanyColumn => ({
  id,
  header,
  accessor: (row) => row[id],
  searchable: true,
  filterable: true,
  sortable: true,
  width,
});

const buildAppsColumn = (width: number): MockCompanyColumn => ({
  id: "apps",
  header: "Apps",
  accessor: (row) => row.apps,
  searchable: true,
  filterable: true,
  sortable: false,
  width,
});

const buildStatusColumn = (searchable: boolean): MockCompanyColumn => ({
  id: "status",
  header: "Estado",
  accessor: (row) => row.status,
  searchable,
  filterable: true,
  sortable: true,
  width: 150,
});

const buildCreatedAtColumn = (): MockCompanyColumn => ({
  id: "createdAt",
  header: "Alta",
  accessor: (row) => row.createdAt,
  type: "date",
  searchable: false,
  filterable: true,
  sortable: true,
  width: 120,
});

export const buildCompanyColumns = ({
  appsWidth,
  statusSearchable,
}: CompanyColumnOptions): MockCompanyColumn[] => [
  buildTextColumn("name", "Empresa", 220),
  buildTextColumn("brand", "Marca", 130),
  buildTextColumn("country", "País", 130),
  buildAppsColumn(appsWidth),
  buildStatusColumn(statusSearchable),
  buildCreatedAtColumn(),
];
