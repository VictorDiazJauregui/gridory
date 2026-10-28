import { useMemo, useState } from "react";
import { DataTable, type DataTableProps } from "../../table";
import type { MockCompanyColumn } from "../company/company-columns";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../company/company-rows";
import { useDemoText } from "../shared/demo-dictionary";
import { useDemoLanguage } from "../shared/demo-language";
import { localizeTableDemoProps } from "../shared/localize-demo-props";
import { buildActionsColumnProps } from "./actions-column";
import { buildTableColumns, TABLE_STATIC_PROPS } from "./table-config";
import { withExpandableRowsDemo } from "./use-expandable-rows-demo";

// The scrolling columns at least this wide, so the table outgrows a desktop screen. The pinned ones keep their
// width: past half of the container (a phone, a narrow window) they let go and scroll like the rest.
const MINIMUM_COLUMN_WIDTH = 240;
const PINS: Record<string, MockCompanyColumn["pin"]> = { name: "left", amount: "right" };

const widenAndPin = (column: MockCompanyColumn): MockCompanyColumn => {
  const pin = PINS[column.id];
  if (pin) return { ...column, pin };
  return { ...column, width: Math.max(column.width ?? 0, MINIMUM_COLUMN_WIDTH) };
};

const usePinnedTableProps = (): DataTableProps<MockCompanyRow> => {
  const [rows, setRows] = useState(MOCK_COMPANY_ROWS);
  const columns = useMemo(() => buildTableColumns(setRows, true).map(widenAndPin), []);
  return withExpandableRowsDemo({
    ...TABLE_STATIC_PROPS,
    columns,
    data: rows,
    features: { createButton: false },
    archivedView: undefined,
    rowSelection: {},
    rowActions: { ...buildActionsColumnProps(setRows), pinned: true },
  });
};

/** Pinned columns (1.4.0): Company on the left, Amount and the actions on the right, over a table wider than the screen. */
export const PinnedColumnsTableMock = () => {
  const title = useDemoText()("Columnas fijas");
  const tableProps = localizeTableDemoProps(usePinnedTableProps(), useDemoLanguage());
  return (
    <section id="columnas-fijas" className="mt-6 space-y-2" aria-label={title}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <DataTable {...tableProps} />
    </section>
  );
};
