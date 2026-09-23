import { useState } from "react";
import { cn } from "../../../lib/cn";
import type {
  DateFilterState,
  DateInputFormat,
  SortDirection,
} from "../data-model";
import { EMPTY_DATE_FILTER_STATE } from "../date-utils";
import { DatePickerWithInput } from "./DatePickerWithInput";
import { DateRangePicker } from "./DateRangePicker";

interface DateFilterMenuProps {
  state: DateFilterState;
  onChange: (next: DateFilterState) => void;
  onClose: () => void;
  sortable?: boolean;
  sortDirection?: SortDirection | null;
  onSortAsc?: () => void;
  onSortDesc?: () => void;
  onSortClear?: () => void;
  dateInputFormat: DateInputFormat;
  calendarMonthYearDropdown: boolean;
  calendarFromYear: number;
  calendarToYear: number;
  emptyState?: DateFilterState;
}

export const DateFilterMenu = ({
  state,
  onChange,
  onClose,
  sortable = false,
  sortDirection = null,
  onSortAsc,
  onSortDesc,
  onSortClear,
  dateInputFormat = "dd/mm/yyyy",
  calendarMonthYearDropdown = true,
  calendarFromYear = new Date().getFullYear() - 100,
  calendarToYear = new Date().getFullYear() + 10,
  emptyState = EMPTY_DATE_FILTER_STATE,
}: DateFilterMenuProps) => {
  const [tempState, setTempState] = useState<DateFilterState>(state);

  const handleApply = () => {
    onChange(tempState);
    onClose();
  };

  const handleClear = () => {
    setTempState(emptyState);
    onChange(emptyState);
    onSortClear?.();
  };

  return (
    <div className="gdy-panel gdy-panel-date">
      {sortable && (
        <div className="gdy-panel-section gdy-panel-section-stack">
          <p className="gdy-panel-title">Ordenar</p>
          <button
            type="button"
            className={cn(
              "gdy-link-btn gdy-link-btn-nowrap",
              sortDirection === "asc" && "is-active",
            )}
            onClick={onSortAsc}
          >
            Ascendente (antigua → reciente)
          </button>
          <button
            type="button"
            className={cn(
              "gdy-link-btn gdy-link-btn-nowrap",
              sortDirection === "desc" && "is-active",
            )}
            onClick={onSortDesc}
          >
            Descendente (reciente → antigua)
          </button>
        </div>
      )}

      <div className="gdy-panel-section gdy-panel-section-stack">
        <p className="gdy-panel-title">Operador</p>
        <button
          type="button"
          className={cn(
            "gdy-link-btn gdy-link-btn-nowrap",
            tempState.op === "gt" && "is-active",
          )}
          onClick={() => setTempState({ ...tempState, op: "gt" })}
        >
          Mayor que (fecha posterior)
        </button>
        <button
          type="button"
          className={cn(
            "gdy-link-btn gdy-link-btn-nowrap",
            tempState.op === "lt" && "is-active",
          )}
          onClick={() => setTempState({ ...tempState, op: "lt" })}
        >
          Menor que (fecha anterior)
        </button>
        <button
          type="button"
          className={cn(
            "gdy-link-btn gdy-link-btn-nowrap",
            tempState.op === "bt" && "is-active",
          )}
          onClick={() => setTempState({ ...tempState, op: "bt" })}
        >
          Entre (rango)
        </button>
      </div>

      {tempState.op !== "" && (
        <div className="gdy-panel-section">
          <p className="gdy-panel-title">Fechas</p>
          {(tempState.op === "gt" || tempState.op === "lt") && (
            <DatePickerWithInput
              value={tempState.date}
              onChange={(date) => setTempState({ ...tempState, date })}
              dateInputFormat={dateInputFormat}
              monthYearDropdown={calendarMonthYearDropdown}
              fromYear={calendarFromYear}
              toYear={calendarToYear}
            />
          )}
          {tempState.op === "bt" && (
            <DateRangePicker
              dateFrom={tempState.dateFrom}
              dateTo={tempState.dateTo}
              onChange={(dateFrom, dateTo) =>
                setTempState({ ...tempState, dateFrom, dateTo })
              }
              dateInputFormat={dateInputFormat}
              monthYearDropdown={calendarMonthYearDropdown}
              fromYear={calendarFromYear}
              toYear={calendarToYear}
            />
          )}
        </div>
      )}

      <div className="gdy-panel-actions">
        <button type="button" className="gdy-link-btn" onClick={handleClear}>
          Limpiar
        </button>
        <button
          type="button"
          className="gdy-btn gdy-btn-primary gdy-btn-xs"
          onClick={handleApply}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};
