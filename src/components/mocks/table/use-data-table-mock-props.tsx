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
import { useRowSelectionDemo, withRowSelectionDemo } from "./use-row-selection-demo";
import { useColumnVisibilityDemo, withColumnVisibilityDemo } from "./use-column-visibility-demo";
import { withExpandableRowsDemo } from "./use-expandable-rows-demo";
import { useColumnWidthsDemo, withColumnWidthsDemo } from "./use-column-widths-demo";
import { EmptyWithCreate } from "../company/EmptyWithCreate";
import { useLoadingToggle } from "../shared/use-loading-toggle";
import { useTextSelectionClickToggle } from "../shared/use-text-selection-click-toggle";
import { readDemoPrintMode } from "./demo-print-mode";
import { useDemoLanguage } from "../shared/demo-language";
import { LANGUAGE_SLOT } from "../shared/demo-language-slot";
import { localizeTableDemoProps } from "../shared/localize-demo-props";

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
    setRows,
    columns,
    data: { results: displayedRows },
    onCreate,
    toggleGroups: [buildScopeToggleGroup(scope, setScope)],
    headerSelectors: [buildCountrySelector(country, setCountry)],
  };
};

interface DemoToggles {
  loading: ReturnType<typeof useLoadingToggle>;
  textSelectionClick: ReturnType<typeof useTextSelectionClickToggle>;
}

// The demo's own toolbar controls (loading, text selection, language) and the print mode read from the URL.
const withDemoControls = (props: DataTableProps<MockCompanyRow>, toggles: DemoToggles) => ({
  ...props,
  toolbarSlots: [...(props.toolbarSlots ?? []), toggles.loading.slot, toggles.textSelectionClick.slot, LANGUAGE_SLOT],
  loading: toggles.loading.loading,
  ignoreTextSelectionClick: toggles.textSelectionClick.enabled,
  printMode: readDemoPrintMode(),
});

export const useDataTableMockProps = (
  openCompany: (row: MockCompanyRow) => void,
): DataTableProps<MockCompanyRow> => {
  const { setRows, ...rowProps } = useTableRowProps();
  const viewSwitch = useViewSwitch("table");
  const hookProps = useTableHookProps(openCompany, setRows);
  const selectionDemo = useRowSelectionDemo();
  const visibilityDemo = useColumnVisibilityDemo();
  const widthsDemo = useColumnWidthsDemo();
  const toggles = { loading: useLoadingToggle(), textSelectionClick: useTextSelectionClickToggle() };
  const language = useDemoLanguage();
  const baseProps = { ...TABLE_STATIC_PROPS, ...rowProps, viewSwitch };
  if (isDemoBaseline()) return baseProps;
  const emptyMessage = <EmptyWithCreate onCreate={rowProps.onCreate} />;
  const demoProps = withDemoControls({ ...baseProps, ...hookProps, emptyMessage }, toggles);
  const firstBatchProps = withColumnVisibilityDemo(withRowSelectionDemo(demoProps, selectionDemo), visibilityDemo);
  const waveFourProps = withColumnWidthsDemo(withExpandableRowsDemo(firstBatchProps), widthsDemo);
  return localizeTableDemoProps(waveFourProps, language);
};
