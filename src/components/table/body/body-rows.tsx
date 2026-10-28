import type { ReactNode } from "react";
import type { Row } from "@tanstack/react-table";
import { resolveRowGroupState } from "../model/row-grouping";
import { TableDataRow } from "./TableDataRow";
import { TableExpandedRow } from "./TableExpandedRow";
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

// The detail goes right after its row, as the group row goes right before the first row of its group.
const buildDataRowElements = <TData,>({ row, model, config }: RowElementsInput<TData>): ReactNode[] => {
  const dataRow = <TableDataRow key={row.id} row={row} config={config} />;
  const { expansion } = model;
  if (!expansion?.canExpand(row.original)) return [dataRow];
  const detailKey = `__expanded__:${row.id}`;
  return [dataRow, <TableExpandedRow key={detailKey} row={row} expansion={expansion} model={model} />];
};

export const buildRowElements = <TData,>(input: RowElementsInput<TData>) => {
  const { model } = input;
  const { groupHeader, isCollapsed } = resolveRowPlacement(input);
  const elements: ReactNode[] = [];
  if (groupHeader) {
    const key = `__group__:${groupHeader.value}`;
    elements.push(<TableGroupRow key={key} header={groupHeader} model={model} />);
  }
  if (!isCollapsed) elements.push(...buildDataRowElements(input));
  return elements;
};
