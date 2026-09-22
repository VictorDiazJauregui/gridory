import { useState } from "react";
import { EMPTY_DATE_FILTER_STATE } from "./constants";
import type { DateFilterState, DateInputFormat, SortDirection } from "./types";
import { cn } from "./utils";
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
    <div className="rdt-panel rdt-panel-date">
      {sortable && (
        <div className="rdt-panel-section rdt-panel-section-stack">
          <p className="rdt-panel-title">Ordenar</p>
          <button
            type="button"
            className={cn(
              "rdt-link-btn rdt-link-btn-nowrap",
              sortDirection === "asc" && "is-active",
            )}
            onClick={onSortAsc}
          >
            Ascendente (antigua → reciente)
          </button>
          <button
            type="button"
            className={cn(
              "rdt-link-btn rdt-link-btn-nowrap",
              sortDirection === "desc" && "is-active",
            )}
            onClick={onSortDesc}
          >
            Descendente (reciente → antigua)
          </button>
        </div>
      )}

      <div className="rdt-panel-section rdt-panel-section-stack">
        <p className="rdt-panel-title">Operador</p>
        <button
          type="button"
          className={cn(
            "rdt-link-btn rdt-link-btn-nowrap",
            tempState.op === "gt" && "is-active",
          )}
          onClick={() => setTempState({ ...tempState, op: "gt" })}
        >
          Mayor que (fecha posterior)
        </button>
        <button
          type="button"
          className={cn(
            "rdt-link-btn rdt-link-btn-nowrap",
            tempState.op === "lt" && "is-active",
          )}
          onClick={() => setTempState({ ...tempState, op: "lt" })}
        >
          Menor que (fecha anterior)
        </button>
        <button
          type="button"
          className={cn(
            "rdt-link-btn rdt-link-btn-nowrap",
            tempState.op === "bt" && "is-active",
          )}
          onClick={() => setTempState({ ...tempState, op: "bt" })}
        >
          Entre (rango)
        </button>
      </div>

      {tempState.op !== "" && (
        <div className="rdt-panel-section">
          <p className="rdt-panel-title">Fechas</p>
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

      <div className="rdt-panel-actions">
        <button type="button" className="rdt-link-btn" onClick={handleClear}>
          Limpiar
        </button>
        <button
          type="button"
          className="rdt-btn rdt-btn-primary rdt-btn-xs"
          onClick={handleApply}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};
