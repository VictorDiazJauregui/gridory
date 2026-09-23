import { normalizeToArray } from "../shared/row-pipeline";
import { formatDateValue, summarizeCard } from "./card-summary";
import { KanbanCardMenu } from "./KanbanCardMenu";
import type {
  ColumnDefinition,
  KanbanGroupOption,
  RowActions,
} from "./types";

interface DefaultKanbanCardProps<TData> {
  card: TData;
  fields: ColumnDefinition<TData>[];
  group: KanbanGroupOption<TData>;
  groupValue: string;
  rowActions?: RowActions<TData>;
}

export const DefaultKanbanCard = <TData,>({
  card,
  fields,
  group,
  groupValue,
  rowActions,
}: DefaultKanbanCardProps<TData>) => {
  const extraFields = fields.slice(2, 4);
  const dateField = fields.find((field) => field.type === "date");
  const { title, subtitle } = summarizeCard(card, fields);

  return (
    <>
      <div className="gdy-kanban-card-head">
        <div className="gdy-kanban-card-main">
          <p className="gdy-kanban-card-title">{title}</p>
          {subtitle ? <p className="gdy-kanban-card-subtitle">{subtitle}</p> : null}
        </div>
        <KanbanCardMenu card={card} rowActions={rowActions} />
      </div>

      <div className="gdy-kanban-card-meta">
        <span className="gdy-kanban-tag">
          {group.label}: {groupValue || "Sin valor"}
        </span>
      </div>

      {extraFields.map((field) => {
        const value = normalizeToArray(field.accessor(card)).join(", ");
        if (!value) return null;
        return (
          <p key={field.id} className="gdy-kanban-card-value">
            <strong className="gdy-kanban-card-value-label">{field.header}:</strong> {value}
          </p>
        );
      })}

      {dateField ? (
        <p className="gdy-kanban-card-value">
          <strong className="gdy-kanban-card-value-label">{dateField.header}:</strong>{" "}
          {formatDateValue(normalizeToArray(dateField.accessor(card))[0] ?? "")}
        </p>
      ) : null}
    </>
  );
};
