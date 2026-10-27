import { Sigma } from "lucide-react";
import { useDemoText } from "../shared/demo-dictionary";
import { formatAmount, type MockCurrency } from "./company-amounts";

interface AmountTotalsProps {
  totals: Partial<Record<MockCurrency, number>>;
}

export const AmountTotals = ({ totals }: AmountTotalsProps) => {
  const entries = Object.entries(totals) as [MockCurrency, number][];
  const translate = useDemoText();
  return (
    <span
      className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs tabular-nums"
      aria-label={translate("Total de las filas filtradas")}
    >
      <Sigma size={14} />
      {entries.length === 0 ? translate("Sin montos") : entries.map(([currency, amount]) => formatAmount({ amount, currency })).join(" · ")}
    </span>
  );
};
