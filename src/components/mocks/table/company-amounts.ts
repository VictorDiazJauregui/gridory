import type { MockCompanyColumn } from "../company/company-columns";
import type { MockCompanyRow } from "../company/company-rows";

export type MockCurrency = "USD" | "PEN";

interface MockCompanyAmount {
  amount: number;
  currency: MockCurrency;
}

const AMOUNT_STEP = 1373;
const AMOUNT_RANGE = 9000;
const MINIMUM_AMOUNT = 1000;

// Deterministic per company, so the demo totals and the screenshots never change between runs.
export const readCompanyAmount = (row: MockCompanyRow): MockCompanyAmount => {
  const seed = Number(row.id.replace(/\D/g, "")) || row.name.length;
  return {
    amount: MINIMUM_AMOUNT + ((seed * AMOUNT_STEP) % AMOUNT_RANGE),
    currency: row.country === "Perú" ? "PEN" : "USD",
  };
};

export const formatAmount = ({ amount, currency }: MockCompanyAmount) =>
  `${currency} ${amount.toLocaleString("es-PE")}`;

export const buildAmountColumn = (): MockCompanyColumn => ({
  id: "amount",
  header: "Monto",
  accessor: (row) => readCompanyAmount(row).amount,
  cell: (row) => formatAmount(readCompanyAmount(row)),
  type: "number",
  sortable: true,
  width: 130,
  align: "right",
});

export const sumAmountsByCurrency = (rows: MockCompanyRow[]) =>
  rows.reduce<Partial<Record<MockCurrency, number>>>((totals, row) => {
    const { amount, currency } = readCompanyAmount(row);
    return { ...totals, [currency]: (totals[currency] ?? 0) + amount };
  }, {});
