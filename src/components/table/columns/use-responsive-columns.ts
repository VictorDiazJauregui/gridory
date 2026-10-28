import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import type { Column, Table } from "@tanstack/react-table";
import { useLatestRef } from "../../shared/use-latest-ref";
import type { TableSettings } from "../settings";
import type { ColumnDefinition } from "../types";
import { measureHeaderWidth } from "./header-width";
import { isSameIdList, resolvePriorityHiddenColumns, type PriorityColumn } from "./priority-columns";

const NO_IDS: string[] = [];

interface ResponsiveColumnsInput<TData> {
  settings: TableSettings<TData>;
  table: Table<TData>;
  wrapRef: RefObject<HTMLDivElement | null>;
}

interface WidthSources {
  wrap: HTMLDivElement;
  measuredWidths: Map<string, number>;
}

const isHideable = <TData,>(definition: ColumnDefinition<TData> | undefined, visibility?: Record<string, boolean>) =>
  Boolean(definition && (definition.hideable || definition.priority !== undefined) && visibility?.[definition.id] !== true);

// Without `width`, the column needs its title; the last measure stands in while it is hidden.
const resolveColumnWidth = <TData,>(column: Column<TData>, definition: ColumnDefinition<TData> | undefined, sources: WidthSources) => {
  if (!definition) return column.columnDef.size ?? 0;
  if (definition.width !== undefined) return definition.width;
  const headerCell = sources.wrap.querySelector(`th[data-column-id="${CSS.escape(column.id)}"]`);
  const measured = measureHeaderWidth(headerCell);
  if (measured !== undefined) sources.measuredWidths.set(column.id, measured);
  return sources.measuredWidths.get(column.id) ?? 0;
};

const buildPriorityColumns = <TData,>({ settings, table }: ResponsiveColumnsInput<TData>, sources: WidthSources) => {
  const definitions = new Map(settings.columns.map((column) => [column.id, column]));
  return table.getVisibleLeafColumns().map((column): PriorityColumn => {
    const definition = definitions.get(column.id);
    return {
      id: column.id,
      width: resolveColumnWidth(column, definition, sources),
      hideable: isHideable(definition, settings.columnVisibility),
      priority: definition?.priority,
    };
  });
};

// The first calculation runs before paint (no flash of the full table); then one per frame on resize. Only the
// border box is observed: a scrollbar that comes and goes after hiding a column cannot feed back into it.
const observeContainer = (wrap: HTMLDivElement, calculate: () => void) => {
  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(calculate);
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(wrap, { box: "border-box" });
  calculate();
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
  };
};

/** Ids `responsiveColumns` hides, in hiding order; always empty without the prop. */
export const useResponsiveColumns = <TData,>(input: ResponsiveColumnsInput<TData>) => {
  const [hiddenIds, setHiddenIds] = useState(NO_IDS);
  const measuredWidths = useRef(new Map<string, number>());
  const isEnabled = Boolean(input.settings.responsiveColumns) && typeof ResizeObserver !== "undefined";
  const columnsKey = input.table.getVisibleLeafColumns().map((column) => column.id).join("|");
  const calculateRef = useLatestRef(() => {
    const wrap = input.wrapRef.current;
    if (!wrap) return;
    const columns = buildPriorityColumns(input, { wrap, measuredWidths: measuredWidths.current });
    const next = resolvePriorityHiddenColumns(columns, wrap.clientWidth);
    setHiddenIds((current) => (isSameIdList(current, next) ? current : next));
  });
  const { wrapRef } = input;
  useLayoutEffect(() => {
    if (!isEnabled || !wrapRef.current) return;
    return observeContainer(wrapRef.current, () => calculateRef.current());
  }, [isEnabled, columnsKey, wrapRef, calculateRef]);
  return isEnabled ? hiddenIds : NO_IDS;
};
