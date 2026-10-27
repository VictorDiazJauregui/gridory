import { useMemo, useState } from "react";
import type { DataTableProps } from "../../table";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../company/company-rows";
import { filterByScope, filterByValue } from "../company/row-filters";
import { buildTableColumns, TABLE_STATIC_PROPS } from "./table-config";
import {
  buildCountrySelector,
  buildScopeToggleGroup,
} from "../company/toolbar-controls";
import {
  useMockRowCreator,
  type CreatedRowTemplate,
} from "../company/use-mock-row-creator";
import { useViewSwitch } from "../company/use-view-switch";
import { isDemoBaseline } from "../../../demo/use-demo-baseline";
import { useTableHookProps } from "./use-table-hook-props";
import { EmptyWithCreate } from "../company/EmptyWithCreate";
import { useLoadingToggle } from "../shared/use-loading-toggle";
import { readDemoPrintMode } from "./demo-print-mode";

const TABLE_CREATED_ROW: CreatedRowTemplate = {
  idPrefix: "new",
  namePrefix: "Empresa nueva",
  status: "Activa",
};

const useTableRowProps = () => {
  const [rows, setRows] = useState(MOCK_COMPANY_ROWS);
  const [scope, setScope] = useState("all");
  const [country, setCountry] = useState("all");
  const columns = useMemo(() => buildTableColumns(setRows, !isDemoBaseline()), []);
  const displayedRows = useMemo(
    () => filterByValue(filterByScope(rows, scope), "country", country),
    [rows, scope, country],
  );
  const onCreate = useMockRowCreator(setRows, TABLE_CREATED_ROW);
  return {
    columns,
    data: { results: displayedRows },
    onCreate,
    toggleGroups: [buildScopeToggleGroup(scope, setScope)],
    headerSelectors: [buildCountrySelector(country, setCountry)],
  };
};

export const useDataTableMockProps = (
  openCompany: (row: MockCompanyRow) => void,
): DataTableProps<MockCompanyRow> => {
  const rowProps = useTableRowProps();
  const viewSwitch = useViewSwitch("table");
  const hookProps = useTableHookProps(openCompany);
  const loadingToggle = useLoadingToggle();
  const baseProps = { ...TABLE_STATIC_PROPS, ...rowProps, viewSwitch };
  if (isDemoBaseline()) return baseProps;
  return {
    ...baseProps,
    ...hookProps,
    toolbarSlots: [...(hookProps.toolbarSlots ?? []), loadingToggle.slot],
    loading: loadingToggle.loading,
    printMode: readDemoPrintMode(),
    emptyMessage: <EmptyWithCreate onCreate={rowProps.onCreate} />,
  };
};
