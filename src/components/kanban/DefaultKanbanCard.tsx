import type {
  ColumnDefinition,
  RowActions,
} from "./types";
import { normalizeToArray } from "./utils";
import { KanbanCardMenu } from "./KanbanCardMenu";
import type { KanbanGroupOption } from "./types";

interface DefaultKanbanCardProps<TData> {
  card: TData;
  fields: ColumnDefinition<TData>[];
  group: KanbanGroupOption<TData>;
  groupValue: string;
  rowActions?: RowActions<TData>;
}

const formatDateValue = (value: string) => {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

export const DefaultKanbanCard = <TData,>({
  card,
  fields,
  group,
  groupValue,
  rowActions,
}: DefaultKanbanCardProps<TData>) => {
  const primaryField = fields[0];
  const secondaryField = fields[1];
  const extraFields = fields.slice(2, 4);
  const dateField = fields.find((field) => field.type === "date");

  const title =
    normalizeToArray(primaryField?.accessor(card) ?? "").join(", ") || "Card";
  const subtitle = secondaryField
    ? normalizeToArray(secondaryField.accessor(card)).join(", ")
    : "";

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
            <strong>{field.header}:</strong> {value}
          </p>
        );
      })}

      {dateField ? (
        <p className="gdy-kanban-card-value">
          <strong>{dateField.header}:</strong>{" "}
          {formatDateValue(normalizeToArray(dateField.accessor(card))[0] ?? "")}
        </p>
      ) : null}
    </>
  );
};
