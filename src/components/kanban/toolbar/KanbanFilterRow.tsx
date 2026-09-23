import { useMemo } from "react";
import { KanbanFilterItem } from "./KanbanFilterItem";
import type { KanbanSectionProps } from "../model/use-kanban-board-state";

export const KanbanFilterRow = <TData,>(props: KanbanSectionProps<TData>) => {
  const { fields, flags } = props.view;
  const filterableFields = useMemo(
    () => fields.filter((field) => field.filterable),
    [fields],
  );
  if (!flags.filtering || filterableFields.length === 0) return null;
  return (
    <div className="gdy-kanban-filter-row">
      {filterableFields.map((field) => (
        <KanbanFilterItem key={field.id} field={field} {...props} />
      ))}
    </div>
  );
};
