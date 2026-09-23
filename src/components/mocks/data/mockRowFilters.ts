import type { MockCompanyRow } from "./mockCompanyRows";

type FilterableField = "country" | "brand";

export const filterByScope = (rows: MockCompanyRow[], scope: string) =>
  rows.filter((row) => scope === "all" || row.createdAt.startsWith("2026"));

export const filterByValue = (
  rows: MockCompanyRow[],
  field: FilterableField,
  value: string,
) => rows.filter((row) => value === "all" || row[field] === value);
