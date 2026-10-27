import type { ColumnFooterContext } from "../../table";
import type { MockCompanyRow } from "../company/company-rows";
import { formatAmount, sumAmountsByCurrency, type MockCurrency } from "./company-amounts";

// One line per currency: the column is narrow and a sum of USD and PEN makes no sense.
export const AmountFooter = ({ filteredRows }: ColumnFooterContext<MockCompanyRow>) => {
  const entries = Object.entries(sumAmountsByCurrency(filteredRows)) as [MockCurrency, number][];
  if (entries.length === 0) return "—";
  return (
    <span className="inline-flex flex-col tabular-nums">
      {entries.map(([currency, amount]) => (
        <span key={currency}>{formatAmount({ amount, currency })}</span>
      ))}
    </span>
  );
};

export const TotalLabelFooter = ({ filteredRows }: ColumnFooterContext<MockCompanyRow>) =>
  `Total (${filteredRows.length} ${filteredRows.length === 1 ? "empresa" : "empresas"})`;
