import { normalizeToArray } from "../../shared/rows/row-pipeline";
import type { ColumnDefinition, KanbanBoardLabels } from "../types";

type CardFieldLabels = Pick<KanbanBoardLabels, "cardFieldLabel" | "formatCardDate">;

interface DefaultKanbanCardFieldsProps<TData> {
  card: TData;
  fields: ColumnDefinition<TData>[];
  labels: CardFieldLabels;
}

interface CardFieldInput<TData> {
  card: TData;
  field: ColumnDefinition<TData>;
  labels: CardFieldLabels;
}

const renderExtraField = <TData,>({ card, field, labels }: CardFieldInput<TData>) => {
  const value = normalizeToArray(field.accessor(card)).join(", ");
  if (!value) return null;
  return (
    <p key={field.id} className="gdy-kanban-card-value">
      <strong className="gdy-kanban-card-value-label">{labels.cardFieldLabel(field.header)}</strong> {value}
    </p>
  );
};

const renderDateField = <TData,>({ card, field, labels }: CardFieldInput<TData>) => (
  <p className="gdy-kanban-card-value">
    <strong className="gdy-kanban-card-value-label">{labels.cardFieldLabel(field.header)}</strong>{" "}
    {labels.formatCardDate(normalizeToArray(field.accessor(card))[0] ?? "")}
  </p>
);

export const DefaultKanbanCardFields = <TData,>({
  card,
  fields,
  labels,
}: DefaultKanbanCardFieldsProps<TData>) => {
  const dateField = fields.find((field) => field.type === "date");
  return (
    <>
      {fields.slice(2, 4).map((field) => renderExtraField({ card, field, labels }))}
      {dateField ? renderDateField({ card, field: dateField, labels }) : null}
    </>
  );
};
