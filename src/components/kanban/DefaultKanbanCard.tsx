import type {
  ReusableColumn,
  ReusableRowActions,
} from "./types";
import { normalizeToArray } from "./utils";
import { KanbanCardMenu } from "./KanbanCardMenu";
import type { ReusableKanbanGroupOption } from "./types";

interface DefaultKanbanCardProps<TData> {
  card: TData;
  fields: ReusableColumn<TData>[];
  group: ReusableKanbanGroupOption<TData>;
  groupValue: string;
  rowActions?: ReusableRowActions<TData>;
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
      <div className="rkb-card-head">
        <div className="rkb-card-main">
          <p className="rkb-card-title">{title}</p>
          {subtitle ? <p className="rkb-card-subtitle">{subtitle}</p> : null}
        </div>
        <KanbanCardMenu card={card} rowActions={rowActions} />
      </div>

      <div className="rkb-meta">
        <span className="rkb-tag">
          {group.label}: {groupValue || "Sin valor"}
        </span>
      </div>

      {extraFields.map((field) => {
        const value = normalizeToArray(field.accessor(card)).join(", ");
        if (!value) return null;
        return (
          <p key={field.id} className="rkb-card-value">
            <strong>{field.header}:</strong> {value}
          </p>
        );
      })}

      {dateField ? (
        <p className="rkb-card-value">
          <strong>{dateField.header}:</strong>{" "}
          {formatDateValue(normalizeToArray(dateField.accessor(card))[0] ?? "")}
        </p>
      ) : null}
    </>
  );
};
