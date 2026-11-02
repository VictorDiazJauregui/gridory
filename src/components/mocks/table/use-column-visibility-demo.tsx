import { useState } from "react";
import type { ColumnDefinition, DataTableProps, ToolbarCustomSlot } from "../../table";
import type { MockCompanyRow } from "../company/company-rows";
import { ColumnVisibilityControls } from "./ColumnVisibilityControls";

type CompanyColumn = ColumnDefinition<MockCompanyRow>;

// Company never hides; Notes and Apps go first (no number, right to left), then by number. Created has no
// width: it counts its title.
const RESPONSIVE_FIELDS: Record<string, Partial<CompanyColumn>> = {
  notes: { hideable: true },
  apps: { hideable: true },
  brand: { priority: 3 },
  createdAt: { priority: 4, width: undefined },
  country: { priority: 5 },
  amount: { priority: 6 },
  status: { priority: 7 },
};

export const withResponsiveFields = (columns: CompanyColumn[]) =>
  columns.map((column) => ({ ...column, ...RESPONSIVE_FIELDS[column.id] }));

const countHiddenColumns = (visibility: Record<string, boolean>) =>
  Object.values(visibility).filter((isShown) => !isShown).length;

/** Column visibility (1.4.0): the app hides Notes on demand; the rest hides with the room left. */
export const useColumnVisibilityDemo = () => {
  const [hideNotes, setHideNotes] = useState(false);
  const [hiddenCount, setHiddenCount] = useState(0);
  const controlsSlot: ToolbarCustomSlot = {
    id: "column-visibility",
    position: "left",
    content: (
      <ColumnVisibilityControls
        hideNotes={hideNotes}
        onToggleNotes={() => setHideNotes((current) => !current)}
        hiddenCount={hiddenCount}
      />
    ),
  };
  const columnVisibility = hideNotes ? { notes: false } : undefined;
  return { columnVisibility, controlsSlot, onColumnVisibilityChange: (visibility: Record<string, boolean>) => setHiddenCount(countHiddenColumns(visibility)) };
};

type ColumnVisibilityDemo = ReturnType<typeof useColumnVisibilityDemo>;

export const withColumnVisibilityDemo = (
  props: DataTableProps<MockCompanyRow>,
  demo: ColumnVisibilityDemo,
): DataTableProps<MockCompanyRow> => ({
  ...props,
  responsiveColumns: true,
  columnVisibility: demo.columnVisibility,
  onColumnVisibilityChange: demo.onColumnVisibilityChange,
  toolbarSlots: [...(props.toolbarSlots ?? []), demo.controlsSlot],
});
