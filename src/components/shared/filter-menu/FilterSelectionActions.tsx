interface FilterSelectionActionsProps {
  filteredCount: number;
  onSelectAll: () => void;
  onClear: () => void;
}

export const FilterSelectionActions = (props: FilterSelectionActionsProps) => (
  <div className="gdy-panel-section">
    <p className="gdy-panel-title">Filtrar</p>
    <div className="gdy-inline-links">
      <button
        type="button"
        className="gdy-link-btn gdy-link-btn-nowrap"
        onClick={props.onSelectAll}
      >
        Seleccionar todo{" "}
        {props.filteredCount > 0 ? `(${props.filteredCount})` : ""}
      </button>
      <button type="button" className="gdy-link-btn" onClick={props.onClear}>
        Limpiar
      </button>
    </div>
  </div>
);
