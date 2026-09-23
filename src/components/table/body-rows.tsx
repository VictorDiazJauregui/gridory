import type { ReactNode } from "react";
import type { Row } from "@tanstack/react-table";
import { resolveRowGroupState } from "./row-grouping";
import { TableDataRow } from "./TableDataRow";
import { TableGroupRow } from "./TableGroupRow";
import type { TableModelProps } from "./use-table-core";

interface RowElementsInput<TData> extends TableModelProps<TData> {
  row: Row<TData>;
  indexInPage: number;
}

export const buildRowElements = <TData,>({
  row,
  indexInPage,
  model,
}: RowElementsInput<TData>): ReactNode[] => {
  const { settings, state, grouping, paging } = model;
  const { groupHeader, isCollapsed } = resolveRowGroupState({
    headers: grouping.headers,
    activeGroupBy: state.activeGroupBy,
    collapsedGroups: state.collapsedGroups,
    absoluteIndex: paging.pageStartIndex + indexInPage,
  });
  const elements: ReactNode[] = [];
  if (groupHeader) {
    const key = `__group__:${groupHeader.value}`;
    elements.push(<TableGroupRow key={key} header={groupHeader} model={model} />);
  }
  if (!isCollapsed) {
    const { onRowClick } = settings;
    elements.push(<TableDataRow key={row.id} row={row} onRowClick={onRowClick} />);
  }
  return elements;
};
