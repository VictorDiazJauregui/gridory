import type { ReactNode } from "react";
import { useControllableState } from "../../shared/state/use-controllable-state";
import { MissingRowIdError } from "../selection/use-row-selection";
import type { TableSettings } from "../settings";
import { toggleExpandedId } from "./expanded-rows";

export interface ExpandedRowsModel<TData> {
  isExpanded: (id: string) => boolean;
  canExpand: (row: TData) => boolean;
  toggleRow: (id: string) => void;
  renderContent: (row: TData) => ReactNode;
}

const NO_IDS: string[] = [];

// Ids of rows that leave `data` are kept: unlike the selection, nothing counts them, and an id without a row
// renders nothing.
const useExpandedIds = <TData>(settings: TableSettings<TData>) =>
  useControllableState({
    value: settings.expandedRowIds,
    defaultValue: settings.defaultExpandedRowIds ?? NO_IDS,
    onChange: settings.onExpandedChange,
    name: "expandedRowIds",
  });

/** `null` without `renderExpandedRow`: no column, no detail rows, no row attributes. */
export const useExpandedRows = <TData>(settings: TableSettings<TData>): ExpandedRowsModel<TData> | null => {
  const [expandedIds, setExpandedIds] = useExpandedIds(settings);
  const { renderExpandedRow, canExpandRow } = settings;
  if (!renderExpandedRow) return null;
  if (!settings.getRowId) throw new MissingRowIdError("renderExpandedRow");
  const expanded = new Set(expandedIds);
  return {
    isExpanded: (id) => expanded.has(id),
    canExpand: (row) => canExpandRow?.(row) !== false,
    toggleRow: (id) => setExpandedIds((current) => toggleExpandedId(current, id)),
    renderContent: renderExpandedRow,
  };
};
