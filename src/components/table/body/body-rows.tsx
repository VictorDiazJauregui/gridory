import type { ReactNode } from "react";
import type { Row } from "@tanstack/react-table";
import { resolveRowGroupState } from "../model/row-grouping";
import { TableDataRow } from "./TableDataRow";
import { TableGroupRow } from "./TableGroupRow";
import type { TableModelProps } from "../model/use-table-core";
import type { TableRowConfig } from "./row-attributes";

interface RowElementsInput<TData> extends TableModelProps<TData> {
  row: Row<TData>;
  indexInPage: number;
  config: TableRowConfig<TData>;
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
  const { row, model, config } = input;
  const { groupHeader, isCollapsed } = resolveRowPlacement(input);
  const elements: ReactNode[] = [];
  if (groupHeader) {
    const key = `__group__:${groupHeader.value}`;
    elements.push(<TableGroupRow key={key} header={groupHeader} model={model} />);
  }
  if (!isCollapsed) {
    elements.push(<TableDataRow key={row.id} row={row} config={config} />);
  }
  return elements;
};
