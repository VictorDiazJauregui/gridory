import { DefaultKanbanCardFields } from "./DefaultKanbanCardFields";
import { DefaultKanbanCardHead } from "./DefaultKanbanCardHead";
import type {
  ColumnDefinition,
  KanbanGroupOption,
  RowActions,
} from "../types";

interface DefaultKanbanCardProps<TData> {
  card: TData;
  fields: ColumnDefinition<TData>[];
  group: KanbanGroupOption<TData>;
  groupValue: string;
  rowActions?: RowActions<TData>;
}

export const DefaultKanbanCard = <TData,>(
  props: DefaultKanbanCardProps<TData>,
) => (
  <>
    <DefaultKanbanCardHead
      card={props.card}
      fields={props.fields}
      rowActions={props.rowActions}
    />
    <div className="gdy-kanban-card-meta">
      <span className="gdy-kanban-tag">
        {props.group.label}: {props.groupValue || "Sin valor"}
      </span>
    </div>
    <DefaultKanbanCardFields card={props.card} fields={props.fields} />
  </>
);
