import type { SelectAllScope } from "../types";

export type HeaderCheckState = boolean | "indeterminate";

export interface ScopeSources<TData> {
  pageRows: TData[];
  filteredRows: TData[];
  scope: SelectAllScope;
  manualPagination: boolean;
}

export interface RowIdentity<TData> {
  getRowId: (row: TData, index: number) => string;
  isRowSelectable?: (row: TData) => boolean;
}

// With `manualPagination` the table only holds the page, so "every filtered row" is the page.
export const resolveScopeRows = <TData>(sources: ScopeSources<TData>) =>
  sources.scope === "filtered" && !sources.manualPagination ? sources.filteredRows : sources.pageRows;

export const collectSelectableIds = <TData>(rows: TData[], identity: RowIdentity<TData>) =>
  rows.flatMap((row, index) =>
    identity.isRowSelectable?.(row) === false ? [] : [identity.getRowId(row, index)],
  );

export const resolveHeaderCheckState = (scopeIds: string[], selected: ReadonlySet<string>): HeaderCheckState => {
  const selectedCount = scopeIds.filter((id) => selected.has(id)).length;
  if (selectedCount === 0) return false;
  return selectedCount === scopeIds.length ? true : "indeterminate";
};

export const toggleSelectedId = (selectedIds: string[], id: string) =>
  selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id];

// A partial header checks the whole scope; only a fully checked one clears it.
export const toggleScopeIds = (selectedIds: string[], scopeIds: string[]) => {
  const selected = new Set(selectedIds);
  const isFullyChecked = scopeIds.length > 0 && scopeIds.every((id) => selected.has(id));
  if (isFullyChecked) return selectedIds.filter((id) => !scopeIds.includes(id));
  return [...selectedIds, ...scopeIds.filter((id) => !selected.has(id))];
};

/** The same array when nothing left `data`, so an unchanged selection never reports a change. */
export const pruneMissingIds = (selectedIds: string[], existingIds: ReadonlySet<string>) => {
  const kept = selectedIds.filter((id) => existingIds.has(id));
  return kept.length === selectedIds.length ? selectedIds : kept;
};
