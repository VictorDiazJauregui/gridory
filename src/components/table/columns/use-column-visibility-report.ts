import { useEffect, useRef } from "react";
import { useLatestRef } from "../../shared/use-latest-ref";
import type { TableModel } from "../model/use-table-core";

const buildVisibility = <TData,>({ settings, table, hiddenByPriority }: TableModel<TData>) => {
  const onScreen = new Set(table.getVisibleLeafColumns().map((column) => column.id));
  return Object.fromEntries(
    settings.columns.map((column) => [column.id, onScreen.has(column.id) && !hiddenByPriority.includes(column.id)]),
  );
};

/** Calls `onColumnVisibilityChange` on mount and whenever the columns on screen change; never twice in a row. */
export const useColumnVisibilityReport = <TData,>(model: TableModel<TData>) => {
  const callbackRef = useLatestRef(model.settings.onColumnVisibilityChange);
  const visibility = buildVisibility(model);
  const reportRef = useLatestRef({ visibility, details: { hiddenByPriority: model.hiddenByPriority } });
  const lastKeyRef = useRef<string>(undefined);
  const key = JSON.stringify([visibility, model.hiddenByPriority]);
  useEffect(() => {
    if (!callbackRef.current || key === lastKeyRef.current) return;
    lastKeyRef.current = key;
    callbackRef.current(reportRef.current.visibility, reportRef.current.details);
  }, [key, callbackRef, reportRef]);
};

/** A filter panel cannot stay open on a column the priority just hid. */
export const useCloseHiddenFilterMenu = <TData,>({ state, hiddenByPriority }: TableModel<TData>) => {
  const { openFilterColumnId, closeFilterMenu } = state;
  const isOpenOnHiddenColumn = openFilterColumnId !== null && hiddenByPriority.includes(openFilterColumnId);
  useEffect(() => {
    if (isOpenOnHiddenColumn) closeFilterMenu();
  }, [isOpenOnHiddenColumn, closeFilterMenu]);
};
