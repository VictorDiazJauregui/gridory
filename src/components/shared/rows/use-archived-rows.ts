import { useMemo } from "react";
import type {
  ArchivedViewConfig,
  ArchivedViewMode,
  RowActions,
} from "../data-model";
import { applyArchivedView } from "./row-pipeline";

interface ArchivedRowsInput<TData> {
  rows: TData[];
  archivedView?: ArchivedViewConfig;
  mode: ArchivedViewMode;
  rowActions?: RowActions<TData>;
}

export const useArchivedRows = <TData>({
  rows,
  archivedView,
  mode,
  rowActions,
}: ArchivedRowsInput<TData>) =>
  useMemo(
    () =>
      archivedView
        ? applyArchivedView({
            rows,
            mode,
            getIsArchived: rowActions?.getIsArchived,
          })
        : rows,
    [rows, mode, archivedView, rowActions],
  );
