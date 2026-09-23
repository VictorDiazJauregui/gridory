import type { DateFilterDraft } from "./use-date-filter-draft";

interface DateFilterActionsProps {
  draft: DateFilterDraft;
}

export const DateFilterActions = ({ draft }: DateFilterActionsProps) => (
  <div className="gdy-panel-actions">
    <button type="button" className="gdy-link-btn" onClick={draft.clear}>
      Limpiar
    </button>
    <button
      type="button"
      className="gdy-btn gdy-btn-primary gdy-btn-xs"
      onClick={draft.apply}
    >
      Aplicar
    </button>
  </div>
);
