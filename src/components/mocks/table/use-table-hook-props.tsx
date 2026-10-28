import { useState } from "react";
import type { DataTableProps, VisibleRowsState } from "../../table";
import type { MockCompanyRow } from "../company/company-rows";
import type { MockRowsUpdater } from "../company/row-updates";
import { SEATS_SLOT } from "../company/demo-toolbar-slots";
import { AmountTotals } from "./AmountTotals";
import { sumAmountsByCurrency } from "./company-amounts";
import { buildActionsColumnProps } from "./actions-column";
import { buildCompanyHref } from "./use-company-detail";
import { readTableDemoClassNames } from "../company/demo-class-names";

type TableHookProps = Pick<
  DataTableProps<MockCompanyRow>,
  "getRowAttributes" | "onVisibleRowsChange" | "toolbarSlots" | "rowActions" | "getRowHref" | "onRowClick" | "classNames"
>;

const markArchivedRow = (row: MockCompanyRow) => ({
  "data-archived": row.status === "Archivada",
});

// The props added in 1.1.0, kept apart so `?baseline=1` can render the 1.0.1 table.
export const useTableHookProps = (openCompany: (row: MockCompanyRow) => void, setRows: MockRowsUpdater): TableHookProps => {
  const [totals, setTotals] = useState<ReturnType<typeof sumAmountsByCurrency>>({});
  const onVisibleRowsChange = ({ filteredRows }: VisibleRowsState<MockCompanyRow>) =>
    setTotals(sumAmountsByCurrency(filteredRows));
  return {
    getRowAttributes: markArchivedRow,
    onVisibleRowsChange,
    toolbarSlots: [{ id: "totals", position: "left", content: <AmountTotals totals={totals} /> }, SEATS_SLOT],
    rowActions: buildActionsColumnProps(setRows),
    getRowHref: buildCompanyHref,
    onRowClick: openCompany,
    classNames: readTableDemoClassNames(),
  };
};
