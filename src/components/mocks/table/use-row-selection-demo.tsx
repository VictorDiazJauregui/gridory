import { useState } from "react";
import type { DataTableProps, RowSelectionConfig, SelectAllScope, ToggleGroupConfig, ToolbarCustomSlot } from "../../table";
import type { MockCompanyRow } from "../company/company-rows";
import { ExportSelectedButton } from "./ExportSelectedButton";

const isActiveRow = (row: MockCompanyRow) => row.status !== "Archivada";

const buildScopeToggle = (scope: SelectAllScope, setScope: (scope: SelectAllScope) => void): ToggleGroupConfig => ({
  id: "select-scope",
  ariaLabel: "Seleccionar todo",
  value: scope,
  onChange: (value) => setScope(value as SelectAllScope),
  options: [
    { value: "page", label: "Página" },
    { value: "filtered", label: "Filtradas" },
  ],
});

/** Row selection (1.4.0): archived companies cannot be selected; the toolbar exports the selection. */
export const useRowSelectionDemo = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [scope, setScope] = useState<SelectAllScope>("page");
  const rowSelection: RowSelectionConfig<MockCompanyRow> = {
    selectedIds,
    onChange: setSelectedIds,
    selectAllScope: scope,
    isRowSelectable: isActiveRow,
  };
  const exportSlot: ToolbarCustomSlot = {
    id: "export-selected",
    position: "left",
    content: <ExportSelectedButton selectedIds={selectedIds} />,
  };
  return { rowSelection, exportSlot, scopeToggle: buildScopeToggle(scope, setScope) };
};

type RowSelectionDemo = ReturnType<typeof useRowSelectionDemo>;

export const withRowSelectionDemo = (
  props: DataTableProps<MockCompanyRow>,
  demo: RowSelectionDemo,
): DataTableProps<MockCompanyRow> => ({
  ...props,
  rowSelection: demo.rowSelection,
  toggleGroups: [...(props.toggleGroups ?? []), demo.scopeToggle],
  toolbarSlots: [...(props.toolbarSlots ?? []), demo.exportSlot],
});
