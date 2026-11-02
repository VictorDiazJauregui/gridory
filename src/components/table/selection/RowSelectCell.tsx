import type { CellContext, Row } from "@tanstack/react-table";
import { readInternalColumnMeta } from "../model/internal-column-meta";
import { PrintValue } from "../body/PrintValue";
import type { DataTableLabels } from "../types";
import type { RowSelectionModel } from "./use-row-selection";
import { SelectCheckbox } from "./SelectCheckbox";

export interface SelectCellSettings<TData> {
  selection: RowSelectionModel<TData>;
  labels: DataTableLabels;
  hasPrintMode: boolean;
}

interface RowSelectCellProps<TData> extends SelectCellSettings<TData> {
  row: Row<TData>;
}

const resolvePrintText = <TData,>({ row, selection, labels, hasPrintMode }: RowSelectCellProps<TData>) => {
  if (!hasPrintMode) return undefined;
  return selection.isSelected(row.id) ? labels.printSelected : labels.printNotSelected;
};

export const RowSelectCell = <TData,>(props: RowSelectCellProps<TData>) => {
  const { row, selection, labels } = props;
  return (
    <>
      <PrintValue text={resolvePrintText(props)} />
      <SelectCheckbox
        checked={selection.isSelected(row.id)}
        label={labels.selectRow}
        disabled={!selection.isSelectable(row.original)}
        onToggle={() => selection.toggleRow(row.id)}
      />
    </>
  );
};

/** The checkbox cell as the column renders it: the selection comes from the table meta. */
export const TableSelectCell = <TData,>({ row, table }: Pick<CellContext<TData, unknown>, "row" | "table">) => {
  const meta = readInternalColumnMeta(table);
  if (!meta?.selection) return null;
  return <RowSelectCell row={row} selection={meta.selection} labels={meta.labels} hasPrintMode={meta.hasPrintMode} />;
};

export const SelectHeaderContent = <TData,>({ selection, labels, hasPrintMode }: SelectCellSettings<TData>) => (
  <>
    <PrintValue text={hasPrintMode ? labels.printSelectionHeader : undefined} />
    <SelectCheckbox
      checked={selection.headerState}
      label={selection.scopeLabel}
      disabled={!selection.hasScopeRows}
      onToggle={selection.toggleScope}
    />
  </>
);
