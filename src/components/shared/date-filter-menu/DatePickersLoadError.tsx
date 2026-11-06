import type { DateFilterMenuLabels } from "../labels/data-view-labels";

interface DatePickersLoadErrorProps {
  labels: Pick<DateFilterMenuLabels, "dateLoadError" | "dateLoadRetry">;
  onRetry: () => void;
}

export const DatePickersLoadError = ({ labels, onRetry }: DatePickersLoadErrorProps) => (
  <div className="gdy-date-load-error" role="alert">
    <p className="gdy-empty-sm">{labels.dateLoadError}</p>
    <button type="button" className="gdy-link-btn" onClick={onRetry}>
      {labels.dateLoadRetry}
    </button>
  </div>
);
