import type { CSSProperties, MouseEvent } from "react";
import type { SelectTheme } from "../shared/select-theme";
import { SimpleSelect } from "../ui/select";
import type { CellHighlight, ColumnDefinition } from "./types";

interface InlineSelectCellProps<TData> {
  column: ColumnDefinition<TData>;
  row: TData;
  value: string;
  highlight?: CellHighlight;
  selectTheme?: SelectTheme;
}

const stopPropagation = (event: MouseEvent) => event.stopPropagation();

export const InlineSelectCell = <TData,>(
  props: InlineSelectCellProps<TData>,
) => {
  const { column, row, value } = props;
  const options = column.inlineEditOptions ?? [];
  const valueExists = options.some((option) => option.value === value);
  const triggerStyle: CSSProperties | undefined = props.highlight?.style;
  return (
    <div className="gdy-table-inline-select-wrap" onClick={stopPropagation}>
      <SimpleSelect
        options={options}
        value={valueExists ? String(value) : ""}
        onValueChange={(next) => column.onInlineEdit?.(row, next)}
        placeholder="Seleccionar..."
        triggerClassName="gdy-table-inline-select"
        triggerStyle={triggerStyle}
        theme={props.selectTheme}
      />
    </div>
  );
};
