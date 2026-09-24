import type { SelectTheme } from "../../shared/select-theme";
import { stopPropagation } from "../../shared/stop-propagation";
import { SimpleSelect } from "../../ui/select/select";
import type { CellHighlight, ColumnDefinition } from "../types";

interface InlineSelectCellProps<TData> {
  column: ColumnDefinition<TData>;
  row: TData;
  value: string;
  highlight?: CellHighlight;
  selectTheme?: SelectTheme;
}

export const InlineSelectCell = <TData,>(
  props: InlineSelectCellProps<TData>,
) => {
  const { column, row, value } = props;
  const options = column.inlineEditOptions ?? [];
  const valueExists = options.some((option) => option.value === value);
  return (
    <div className="gdy-table-inline-select-wrap" onClick={stopPropagation}>
      <SimpleSelect
        options={options}
        value={valueExists ? String(value) : ""}
        onValueChange={(next) => column.onInlineEdit?.(row, next)}
        placeholder="Seleccionar..."
        triggerClassName="gdy-table-inline-select"
        triggerStyle={props.highlight?.style}
        theme={props.selectTheme}
      />
    </div>
  );
};
