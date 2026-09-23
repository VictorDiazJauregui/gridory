import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import type { FilterOption, SortDirection } from "../data-model";

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
    <div className="gdy-panel">
      {sortable && (
        <div className="gdy-panel-section gdy-panel-section-stack">
          <p className="gdy-panel-title">Ordenar</p>
          <button
            type="button"
            className="gdy-link-btn"
            aria-pressed={sortDirection === "asc"}
            onClick={onSortAsc}
          >
            Ascendente (A → Z)
          </button>
          <button
            type="button"
            className="gdy-link-btn"
            aria-pressed={sortDirection === "desc"}
            onClick={onSortDesc}
          >
            Descendente (Z → A)
          </button>
        </div>
      )}

      <div className="gdy-panel-section">
        <p className="gdy-panel-title">Filtrar</p>
        <div className="gdy-inline-links">
          <button
            type="button"
            className="gdy-link-btn gdy-link-btn-nowrap"
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
            className="gdy-link-btn"
            onClick={() => onSelectedChange([])}
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="gdy-panel-section">
        <p className="gdy-panel-title">Valores</p>
        <div className="gdy-search-sm">
          <Search className="gdy-search-sm-icon" size={14} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar..."
            className="gdy-input gdy-input-sm"
          />
        </div>
        <div className="gdy-option-list gdy-scroll">
          {filteredOptions.length === 0 ? (
            <p className="gdy-empty-sm">Sin resultados</p>
          ) : (
            filteredOptions.map((option) => {
              const isChecked = selectedSet.has(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  className="gdy-option-item"
                  data-selected={isChecked || undefined}
                  onClick={() => toggleSelection(option.value)}
                >
                  <span
                    className="gdy-option-check"
                    data-checked={isChecked || undefined}
                  >
                    {isChecked ? (
                      <Check size={11} className="gdy-option-check-icon" />
                    ) : null}
                  </span>
                  <span className="gdy-option-label" title={option.label}>
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
