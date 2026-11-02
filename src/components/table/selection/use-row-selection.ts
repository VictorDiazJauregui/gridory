import { useEffect, useRef } from "react";
import { isDevelopmentBuild } from "../../shared/state/development-build";
import { useControllableState } from "../../shared/state/use-controllable-state";
import { useLatestRef } from "../../shared/use-latest-ref";
import type { TableSettings } from "../settings";
import type { RowSelectionConfig } from "../types";
import {
  collectSelectableIds,
  pruneMissingIds,
  resolveHeaderCheckState,
  resolveScopeRows,
  toggleScopeIds,
  toggleSelectedId,
  type HeaderCheckState,
  type RowIdentity,
} from "./row-selection";

const MISSING_ROW_ID_MESSAGES = {
  rowSelection: "rowSelection needs getRowId: the selection keeps row ids, and index keys change with every sort or page.",
  renderExpandedRow: "renderExpandedRow needs getRowId: open rows are kept by id, and index keys change with every sort or page.",
};

export class MissingRowIdError extends Error {
  constructor(feature: keyof typeof MISSING_ROW_ID_MESSAGES = "rowSelection") {
    super(MISSING_ROW_ID_MESSAGES[feature]);
    this.name = "MissingRowIdError";
  }
}

export interface SelectionRows<TData> {
  allRows: TData[];
  pageRows: TData[];
  filteredRows: TData[];
}

export interface RowSelectionModel<TData> {
  isSelected: (id: string) => boolean;
  isSelectable: (row: TData) => boolean;
  toggleRow: (id: string) => void;
  toggleScope: () => void;
  headerState: HeaderCheckState;
  hasScopeRows: boolean;
  scopeLabel: string;
}

const NO_SELECTION: RowSelectionConfig<never> = {};
const NO_IDS: string[] = [];

const resolveIdentity = <TData>(settings: TableSettings<TData>): RowIdentity<TData> | null => {
  if (!settings.rowSelection) return null;
  if (!settings.getRowId) throw new MissingRowIdError();
  return { getRowId: settings.getRowId, isRowSelectable: settings.rowSelection.isRowSelectable };
};

const useSelectedIds = <TData>(config: RowSelectionConfig<TData>) =>
  useControllableState({
    value: config.selectedIds,
    defaultValue: config.defaultSelectedIds ?? NO_IDS,
    onChange: config.onChange,
    name: "rowSelection.selectedIds",
  });

const useFilteredScopeWarning = <TData>(settings: TableSettings<TData>) => {
  const warned = useRef(false);
  const isIgnored = settings.rowSelection?.selectAllScope === "filtered" && settings.manualPagination;
  useEffect(() => {
    if (!isIgnored || warned.current || !isDevelopmentBuild()) return;
    warned.current = true;
    console.warn('gridory: rowSelection.selectAllScope "filtered" acts as "page" with manualPagination.');
  }, [isIgnored]);
};

type SetSelectedIds = ReturnType<typeof useSelectedIds>[1];

// With `manualPagination`, `data` is one page: a missing id may sit on another page, so the app prunes it.
const usePruneMissingIds = <TData>(
  settings: TableSettings<TData>,
  { allRows, setSelectedIds }: { allRows: TData[]; setSelectedIds: SetSelectedIds },
) => {
  const setterRef = useLatestRef(setSelectedIds);
  const getRowIdRef = useLatestRef(settings.getRowId);
  const skipsPruning = !settings.rowSelection || settings.manualPagination || Boolean(settings.loading);
  useEffect(() => {
    const getRowId = getRowIdRef.current;
    if (skipsPruning || !getRowId) return;
    const existingIds = new Set(allRows.map((row, index) => getRowId(row, index)));
    setterRef.current((selectedIds) => pruneMissingIds(selectedIds, existingIds));
  }, [allRows, skipsPruning, setterRef, getRowIdRef]);
};

interface SelectionModelInput<TData> {
  identity: RowIdentity<TData>;
  selectedIds: string[];
  setSelectedIds: SetSelectedIds;
  scopeIds: string[];
  scopeLabel: string;
}

const buildSelectionModel = <TData>(input: SelectionModelInput<TData>): RowSelectionModel<TData> => {
  const { identity, selectedIds, setSelectedIds, scopeIds } = input;
  const selected = new Set(selectedIds);
  return {
    isSelected: (id) => selected.has(id),
    isSelectable: (row) => identity.isRowSelectable?.(row) !== false,
    toggleRow: (id) => setSelectedIds((current) => toggleSelectedId(current, id)),
    toggleScope: () => setSelectedIds((current) => toggleScopeIds(current, scopeIds)),
    headerState: resolveHeaderCheckState(scopeIds, selected),
    hasScopeRows: scopeIds.length > 0,
    scopeLabel: input.scopeLabel,
  };
};

const resolveScopeLabel = <TData>({ rowSelection, manualPagination, labels }: TableSettings<TData>) =>
  rowSelection?.selectAllScope === "filtered" && !manualPagination ? labels.selectFilteredRows : labels.selectPageRows;

/** `null` without `rowSelection`: no column, no row attributes. */
export const useRowSelection = <TData>(
  settings: TableSettings<TData>,
  rows: SelectionRows<TData>,
): RowSelectionModel<TData> | null => {
  const { rowSelection, manualPagination } = settings;
  const identity = resolveIdentity(settings);
  const [selectedIds, setSelectedIds] = useSelectedIds(rowSelection ?? NO_SELECTION);
  useFilteredScopeWarning(settings);
  usePruneMissingIds(settings, { allRows: rows.allRows, setSelectedIds });
  if (!identity) return null;
  const scopeRows = resolveScopeRows({ ...rows, scope: rowSelection?.selectAllScope ?? "page", manualPagination });
  const scopeIds = collectSelectableIds(scopeRows, identity);
  return buildSelectionModel({ identity, selectedIds, setSelectedIds, scopeIds, scopeLabel: resolveScopeLabel(settings) });
};
