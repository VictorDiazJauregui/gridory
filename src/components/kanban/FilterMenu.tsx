import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import type {
  FilterOption,
  SortDirection,
} from "./types";
import { cn } from "./utils";

interface FilterMenuProps {
  options: FilterOption[];
  selected: string[];
  onSelectedChange: (next: string[]) => void;
  sortable: boolean;
  sortDirection: SortDirection | null;
  onSortAsc: () => void;
  onSortDesc: () => void;
}

export const FilterMenu = ({
  options,
  selected,
  onSelectedChange,
  sortable,
  sortDirection,
  onSortAsc,
  onSortDesc,
}: FilterMenuProps) => {
  const [search, setSearch] = useState("");
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const normalizedSearch = search.trim().toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(normalizedSearch) ||
        option.value.toLowerCase().includes(normalizedSearch),
    );
  }, [options, search]);

  const toggleSelection = (value: string) => {
    if (selectedSet.has(value)) {
      onSelectedChange(selected.filter((item) => item !== value));
      return;
    }
    onSelectedChange([...selected, value]);
  };

  return (
    <div className="rkb-panel">
      {sortable && (
        <div className="rkb-panel-section rkb-panel-section-stack">
          <p className="rkb-panel-title">Ordenar</p>
          <button
            type="button"
            className={cn(
              "rkb-link-btn",
              sortDirection === "asc" && "is-active",
            )}
            onClick={onSortAsc}
          >
            Ascendente (A → Z)
          </button>
          <button
            type="button"
            className={cn(
              "rkb-link-btn",
              sortDirection === "desc" && "is-active",
            )}
            onClick={onSortDesc}
          >
            Descendente (Z → A)
          </button>
        </div>
      )}

      <div className="rkb-panel-section">
        <p className="rkb-panel-title">Filtrar</p>
        <div className="rkb-inline-links">
          <button
            type="button"
            className="rkb-link-btn rkb-link-btn-nowrap"
            onClick={() =>
              onSelectedChange(
                Array.from(
                  new Set([
                    ...selected,
                    ...filteredOptions.map((option) => option.value),
                  ]),
                ),
              )
            }
          >
            Seleccionar todo{" "}
            {filteredOptions.length > 0 ? `(${filteredOptions.length})` : ""}
          </button>
          <button
            type="button"
            className="rkb-link-btn"
            onClick={() => onSelectedChange([])}
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="rkb-panel-section">
        <p className="rkb-panel-title">Valores</p>
        <div className="rkb-search-sm">
          <Search className="rkb-search-sm-icon" size={14} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar..."
            className="rkb-input rkb-input-sm"
          />
        </div>
        <div className="rkb-option-list">
          {filteredOptions.length === 0 ? (
            <p className="rkb-empty-sm">Sin resultados</p>
          ) : (
            filteredOptions.map((option) => {
              const isChecked = selectedSet.has(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn("rkb-option-item", isChecked && "is-selected")}
                  onClick={() => toggleSelection(option.value)}
                >
                  <span
                    className={cn(
                      "rkb-option-check",
                      isChecked && "is-checked",
                    )}
                  >
                    {isChecked ? <Check size={11} /> : null}
                  </span>
                  <span className="rkb-option-label" title={option.label}>
                    {option.label}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
