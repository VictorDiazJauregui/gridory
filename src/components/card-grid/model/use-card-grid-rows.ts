import { useMemo } from "react";
import { useVisibleCards } from "../../kanban/model/use-visible-cards";
import type { useViewControls } from "../../shared/controls/use-view-controls";
import type { ColumnDefinition } from "../../shared/data-model";
import { computeColumnFilterOptions, normalizeInputRows } from "../../shared/rows/row-pipeline";
import type { CardGridSettings } from "../settings";

type ViewControls = ReturnType<typeof useViewControls>;

/** The settings under the name the kanban pieces read the columns by. */
type CardGridFieldSettings<TData> = CardGridSettings<TData> & { fields: ColumnDefinition<TData>[] };

// Ids follow the position in `data`, as in the table, so they stay the same after a search or a sort.
const useRowIds = <TData>(rows: TData[], getRowId: CardGridSettings<TData>["getRowId"]) =>
  useMemo(() => new Map(rows.map((row, index) => [row, getRowId?.(row, index) ?? String(index)])), [rows, getRowId]);

export const useCardGridRows = <TData>(settings: CardGridFieldSettings<TData>, controls: ViewControls) => {
  const { data, normalizeRow, fields } = settings;
  const rows = useMemo(() => normalizeInputRows(data, normalizeRow), [data, normalizeRow]);
  const visibleRows = useVisibleCards({ cards: rows, view: settings, ...controls });
  const filterOptions = useMemo(() => computeColumnFilterOptions(fields, rows), [fields, rows]);
  return { visibleRows, filterOptions, rowIds: useRowIds(rows, settings.getRowId) };
};
