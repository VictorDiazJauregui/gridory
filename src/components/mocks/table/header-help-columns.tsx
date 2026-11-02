import type { ColumnDefinition } from "../../table";
import type { MockCompanyRow } from "../company/company-rows";
import { CountryHeader } from "./CountryHeader";

type CompanyColumn = ColumnDefinition<MockCompanyRow>;

// One help icon per placement: Amount takes the default ("before", it is right-aligned).
const HEADER_FIELDS: Record<string, Partial<CompanyColumn>> = {
  amount: { headerTooltip: "Suma de los contratos vigentes, en su moneda" },
  createdAt: { headerTooltip: "Fecha en que la empresa se dio de alta", headerTooltipPlacement: "after" },
  status: { headerTooltip: "Activa, Pendiente o Archivada; se cambia desde la celda", headerTooltipPlacement: "edge" },
  country: { headerContent: <CountryHeader /> },
};

export const withHeaderHelp = (columns: CompanyColumn[]) =>
  columns.map((column) => ({ ...column, ...HEADER_FIELDS[column.id] }));
