import { useLayoutEffect, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { Table } from "@tanstack/react-table";
import { useControllableState } from "../../shared/state/use-controllable-state";
import type { TableSettings } from "../settings";
import type { ColumnDefinition } from "../types";
import { resolveInternalColumnWidth } from "../columns/internal-columns";
import {
  clampWidth,
  resolveLayoutWidth,
  resolveWidthLimits,
  withColumnWidth,
  withoutColumnWidth,
  type ColumnWidthMap,
  type WidthLimits,
  type WidthSources,
} from "../columns/column-widths";
import { isSameWidthMap, measureHeaderCells } from "./measure-header-cells";

export interface ResizeDraft {
  columnId: string;
  width: number;
  source: "pointer" | "keyboard";
}

export interface ColumnWidthsModel {
  /** Width of every column on screen once the table lays out by their sum; `null` while the browser shares it out. */
  layoutWidths: ReadonlyMap<string, number> | null;
  /** The same without the width being resized: what the priority counts, so no column hides mid-drag. */
  committedWidths: ReadonlyMap<string, number> | null;
  isPointerResizing: boolean;
  /** The column whose width the user set last, until another one is set or it is reset: the priority skips it. */
  resizedColumnId: string | null;
  readWidth: (columnId: string) => number;
  readLimits: (columnId: string) => WidthLimits;
  freeze: () => void;
  preview: (draft: ResizeDraft) => void;
  commit: (columnId: string, width: number) => void;
  reset: (columnId: string) => void;
  cancel: () => void;
}

interface ColumnWidthsInput<TData> {
  settings: TableSettings<TData>;
  table: Table<TData>;
  wrapRef: RefObject<HTMLDivElement | null>;
}

interface ColumnWidthsState<TData> extends ColumnWidthsInput<TData> {
  definitions: Map<string, ColumnDefinition<TData>>;
  userWidths: ColumnWidthMap;
  setUserWidths: Dispatch<SetStateAction<ColumnWidthMap>>;
  measuredWidths: ColumnWidthMap | null;
  setMeasuredWidths: Dispatch<SetStateAction<ColumnWidthMap | null>>;
  draft: ResizeDraft | null;
  setDraft: Dispatch<SetStateAction<ResizeDraft | null>>;
  resizedColumnId: string | null;
  setResizedColumnId: Dispatch<SetStateAction<string | null>>;
}

const NO_WIDTHS: ColumnWidthMap = {};

const useUserWidths = <TData,>(settings: TableSettings<TData>) =>
  useControllableState<ColumnWidthMap>({
    value: settings.columnWidths,
    defaultValue: settings.defaultColumnWidths ?? NO_WIDTHS,
    onChange: settings.onColumnWidthsChange,
    name: "columnWidths",
  });

interface MeasureConditions {
  isEnabled: boolean;
  hasUserLayout: boolean;
  columnsKey: string;
}

// While the browser shares the width out, only measuring tells the widths on screen, and the measure before the
// user's first width is the one the resized layout freezes; re-measured once per frame while the container resizes.
const observeHeaderWidths = (wrap: HTMLDivElement, update: (widths: ColumnWidthMap) => void) => {
  let frame = 0;
  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => update(measureHeaderCells(wrap)));
  });
  observer.observe(wrap, { box: "border-box" });
  update(measureHeaderCells(wrap));
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
  };
};

const useMeasuredWidths = <TData,>({ wrapRef }: ColumnWidthsInput<TData>, conditions: MeasureConditions) => {
  const [measuredWidths, setMeasuredWidths] = useState<ColumnWidthMap | null>(null);
  const { isEnabled, hasUserLayout, columnsKey } = conditions;
  const isMeasuring = isEnabled && (!hasUserLayout || measuredWidths === null);
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!isMeasuring || !wrap) return;
    return observeHeaderWidths(wrap, (next) =>
      setMeasuredWidths((current) => (isSameWidthMap(current, next) ? current : next)),
    );
  }, [wrapRef, isMeasuring, columnsKey]);
  return [measuredWidths, setMeasuredWidths] as const;
};

const clampUserWidths = <TData,>({ userWidths, definitions }: ColumnWidthsState<TData>): ColumnWidthMap =>
  Object.fromEntries(
    Object.entries(userWidths).map(([id, width]) => [id, clampWidth(width, resolveWidthLimits(definitions.get(id)))]),
  );

const buildWidthSources = <TData,>(state: ColumnWidthsState<TData>): WidthSources => ({
  userWidths: clampUserWidths(state),
  frozenWidths: state.measuredWidths ?? NO_WIDTHS,
  fallbackWidth: (columnId) => {
    if (!state.definitions.has(columnId)) return resolveInternalColumnWidth(columnId, state.settings.rowActions);
    const definition = state.definitions.get(columnId);
    return definition?.width ?? resolveWidthLimits(definition).min;
  },
});

const buildLayoutWidths = <TData,>(state: ColumnWidthsState<TData>, sources: WidthSources, draft: ResizeDraft | null) =>
  new Map(
    state.table.getVisibleLeafColumns().map((column): [string, number] => {
      if (draft?.columnId === column.id) return [column.id, draft.width];
      return [column.id, resolveLayoutWidth(column.id, sources)];
    }),
  );

const isResizedLayout = <TData,>(state: ColumnWidthsState<TData>) =>
  state.measuredWidths !== null && (Object.keys(state.userWidths).length > 0 || state.draft !== null);

const buildWidthReaders = <TData,>(state: ColumnWidthsState<TData>, layoutWidths: ReadonlyMap<string, number> | null) => {
  const sources = buildWidthSources(state);
  return {
    readLimits: (columnId: string) => resolveWidthLimits(state.definitions.get(columnId)),
    readWidth: (columnId: string) => {
      if (state.draft?.columnId === columnId) return state.draft.width;
      return Math.round(layoutWidths?.get(columnId) ?? resolveLayoutWidth(columnId, sources));
    },
  };
};

const buildWidthActions = <TData,>(state: ColumnWidthsState<TData>, isResized: boolean) => ({
  freeze: () => {
    const wrap = state.wrapRef.current;
    if (!isResized && wrap) state.setMeasuredWidths(measureHeaderCells(wrap));
  },
  preview: (draft: ResizeDraft) => state.setDraft(draft),
  commit: (columnId: string, width: number) => {
    state.setDraft(null);
    state.setResizedColumnId(columnId);
    state.setUserWidths((current) => withColumnWidth(current, columnId, width));
  },
  reset: (columnId: string) => {
    state.setDraft(null);
    state.setResizedColumnId((current) => (current === columnId ? null : current));
    state.setUserWidths((current) => withoutColumnWidth(current, columnId));
  },
  cancel: () => state.setDraft(null),
});

const buildColumnWidthsModel = <TData,>(state: ColumnWidthsState<TData>): ColumnWidthsModel => {
  const isResized = isResizedLayout(state);
  const sources = buildWidthSources(state);
  const layoutWidths = isResized ? buildLayoutWidths(state, sources, state.draft) : null;
  return {
    layoutWidths,
    committedWidths: isResized ? buildLayoutWidths(state, sources, null) : null,
    isPointerResizing: state.draft?.source === "pointer",
    resizedColumnId: state.resizedColumnId,
    ...buildWidthReaders(state, layoutWidths),
    ...buildWidthActions(state, isResized),
  };
};

/** `null` without `resizableColumns`: no handle, no measuring, the browser lays the columns out as before. */
export const useColumnWidths = <TData,>(input: ColumnWidthsInput<TData>): ColumnWidthsModel | null => {
  const [userWidths, setUserWidths] = useUserWidths(input.settings);
  const [draft, setDraft] = useState<ResizeDraft | null>(null);
  const [resizedColumnId, setResizedColumnId] = useState<string | null>(null);
  const isEnabled = Boolean(input.settings.resizableColumns);
  const columnsKey = input.table.getVisibleLeafColumns().map((column) => column.id).join("|");
  const hasUserLayout = Object.keys(userWidths).length > 0 || draft !== null;
  const [measuredWidths, setMeasuredWidths] = useMeasuredWidths(input, { isEnabled, hasUserLayout, columnsKey });
  if (!isEnabled) return null;
  const definitions = new Map(input.settings.columns.map((column) => [column.id, column]));
  const state = { ...input, definitions, userWidths, setUserWidths, measuredWidths, setMeasuredWidths, draft, setDraft, resizedColumnId, setResizedColumnId };
  return buildColumnWidthsModel(state);
};
