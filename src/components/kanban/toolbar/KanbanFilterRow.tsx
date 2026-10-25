import { useMemo } from "react";
import { cn } from "../../../lib/cn";
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
    <div className={cn("gdy-kanban-filter-row", props.view.classNames?.filterRow)}>
      {filterableFields.map((field) => (
        <KanbanFilterItem key={field.id} field={field} {...props} />
      ))}
    </div>
  );
};
