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

const TABLE_CREATED_ROW: CreatedRowTemplate = {
  idPrefix: "new",
  namePrefix: "Empresa nueva",
  status: "Activa",
};

const useTableRowProps = () => {
  const [rows, setRows] = useState(MOCK_COMPANY_ROWS);
  const [scope, setScope] = useState("all");
  const [country, setCountry] = useState("all");
  const columns = useMemo(() => buildTableColumns(setRows), []);
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

export const useDataTableMockProps = (): DataTableProps<MockCompanyRow> => {
  const rowProps = useTableRowProps();
  const viewSwitch = useViewSwitch("table");
  return { ...TABLE_STATIC_PROPS, ...rowProps, viewSwitch };
};
