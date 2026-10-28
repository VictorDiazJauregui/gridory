import { DefaultKanbanCardFields } from "./DefaultKanbanCardFields";
import { DefaultKanbanCardHead } from "./DefaultKanbanCardHead";
import type {
  ColumnDefinition,
  KanbanBoardLabels,
  KanbanGroupOption,
  RowActions,
} from "../types";
import type { CardMoveEntry } from "./move-menu-node";

interface DefaultKanbanCardProps<TData> {
  card: TData;
  fields: ColumnDefinition<TData>[];
  group: KanbanGroupOption<TData>;
  groupValue: string;
  rowActions?: RowActions<TData>;
  labels: KanbanBoardLabels;
  move?: CardMoveEntry;
}

export const DefaultKanbanCard = <TData,>(props: DefaultKanbanCardProps<TData>) => {
  const { card, fields, labels } = props;
  return (
    <>
      <DefaultKanbanCardHead card={card} fields={fields} rowActions={props.rowActions} labels={labels} move={props.move} />
      <div className="gdy-kanban-card-meta">
        <span className="gdy-kanban-tag">
          {labels.labeledValue(props.group.label, props.groupValue || labels.emptyValue)}
        </span>
      </div>
      <DefaultKanbanCardFields card={card} fields={fields} labels={labels} />
    </>
  );
};
