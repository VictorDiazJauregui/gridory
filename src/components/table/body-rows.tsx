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

const resolveRowPlacement = <TData,>({
  indexInPage,
  model,
}: RowElementsInput<TData>) => {
  const { state, grouping, paging } = model;
  const absoluteIndex = paging.range.pageStartIndex + indexInPage;
  return resolveRowGroupState(grouping.headers, state, absoluteIndex);
};

export const buildRowElements = <TData,>(input: RowElementsInput<TData>) => {
  const { row, model } = input;
  const { groupHeader, isCollapsed } = resolveRowPlacement(input);
  const elements: ReactNode[] = [];
  if (groupHeader) {
    const key = `__group__:${groupHeader.value}`;
    elements.push(<TableGroupRow key={key} header={groupHeader} model={model} />);
  }
  if (!isCollapsed) {
    const { onRowClick } = model.settings;
    elements.push(<TableDataRow key={row.id} row={row} onRowClick={onRowClick} />);
  }
  return elements;
};
