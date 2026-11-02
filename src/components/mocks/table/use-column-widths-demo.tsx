import { useState } from "react";
import type { DataTableProps, ToolbarCustomSlot } from "../../table";
import type { MockCompanyRow } from "../company/company-rows";
import { ColumnWidthsControls } from "./ColumnWidthsControls";
import { readStoredColumnWidths, storeColumnWidths } from "./column-widths-storage";

/** Resizable columns (1.4.0): the widths survive a reload from localStorage, and a button drops them. */
export const useColumnWidthsDemo = () => {
  const [columnWidths, setColumnWidths] = useState(readStoredColumnWidths);
  const saveColumnWidths = (widths: Record<string, number>) => {
    setColumnWidths(widths);
    storeColumnWidths(widths);
  };
  const controlsSlot: ToolbarCustomSlot = {
    id: "column-widths",
    position: "left",
    content: <ColumnWidthsControls savedCount={Object.keys(columnWidths).length} onReset={() => saveColumnWidths({})} />,
  };
  return { columnWidths, saveColumnWidths, controlsSlot };
};

type ColumnWidthsDemo = ReturnType<typeof useColumnWidthsDemo>;

export const withColumnWidthsDemo = (
  props: DataTableProps<MockCompanyRow>,
  demo: ColumnWidthsDemo,
): DataTableProps<MockCompanyRow> => ({
  ...props,
  resizableColumns: true,
  columnWidths: demo.columnWidths,
  onColumnWidthsChange: demo.saveColumnWidths,
  toolbarSlots: [...(props.toolbarSlots ?? []), demo.controlsSlot],
});
