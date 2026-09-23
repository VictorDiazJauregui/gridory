import { normalizeToArray } from "../shared/row-pipeline";
import { formatDateValue } from "./card-summary";
import type { ColumnDefinition } from "./types";

interface DefaultKanbanCardFieldsProps<TData> {
  card: TData;
  fields: ColumnDefinition<TData>[];
}

const renderExtraField = <TData,>(
  card: TData,
  field: ColumnDefinition<TData>,
) => {
  const value = normalizeToArray(field.accessor(card)).join(", ");
  if (!value) return null;
  return (
    <p key={field.id} className="gdy-kanban-card-value">
      <strong className="gdy-kanban-card-value-label">{field.header}:</strong> {value}
    </p>
  );
};

const renderDateField = <TData,>(
  card: TData,
  field?: ColumnDefinition<TData>,
) => {
  if (!field) return null;
  return (
    <p className="gdy-kanban-card-value">
      <strong className="gdy-kanban-card-value-label">{field.header}:</strong>{" "}
      {formatDateValue(normalizeToArray(field.accessor(card))[0] ?? "")}
    </p>
  );
};

export const DefaultKanbanCardFields = <TData,>({
  card,
  fields,
}: DefaultKanbanCardFieldsProps<TData>) => (
  <>
    {fields.slice(2, 4).map((field) => renderExtraField(card, field))}
    {renderDateField(card, fields.find((field) => field.type === "date"))}
  </>
);
