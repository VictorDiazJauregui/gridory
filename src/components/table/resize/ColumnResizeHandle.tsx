import type { TableColumnProps } from "../model/use-table-core";
import type { ColumnWidthsModel } from "./use-column-widths";
import { buildResizeControl } from "./resize-control";
import { useResizeDrag } from "./use-resize-drag";
import { useResizeKeyboard } from "./use-resize-keyboard";

interface ColumnResizeHandleProps<TData> extends TableColumnProps<TData> {
  widths: ColumnWidthsModel;
}

const buildSeparatorAttributes = <TData,>({ column, model, widths }: ColumnResizeHandleProps<TData>) => {
  const limits = widths.readLimits(column.id);
  const width = widths.readWidth(column.id);
  const { labels } = model.settings;
  return {
    role: "separator",
    "aria-orientation": "vertical" as const,
    "aria-valuenow": width,
    "aria-valuetext": labels.resizeColumnValue(width),
    "aria-valuemin": limits.min,
    "aria-valuemax": limits.max,
    "aria-label": labels.resizeColumn(column.header),
    tabIndex: 0,
  };
};

export const ColumnResizeHandle = <TData,>(props: ColumnResizeHandleProps<TData>) => {
  const control = buildResizeControl({ columnId: props.column.id, model: props.model, widths: props.widths });
  const pointerHandlers = useResizeDrag(control);
  const keyboardHandlers = useResizeKeyboard(control);
  return (
    <div
      className="gdy-table-resize-handle"
      {...buildSeparatorAttributes(props)}
      onDoubleClick={control.reset}
      {...pointerHandlers}
      {...keyboardHandlers}
    />
  );
};
