import { hasColumnFilter } from "../../shared/controls/column-filters";
import { FilterMenuHolder } from "../../shared/controls/FilterMenuHolder";
import type { KanbanFilterItemProps } from "./filter-item";
import { KanbanDateFilterMenu } from "./KanbanDateFilterMenu";
import { KanbanFilterTrigger } from "./KanbanFilterTrigger";
import { KanbanValueFilterMenu } from "./KanbanValueFilterMenu";

const renderFieldMenu = <TData,>(props: KanbanFilterItemProps<TData>) =>
  props.field.type === "date" ? (
    <KanbanDateFilterMenu {...props} />
  ) : (
    <KanbanValueFilterMenu {...props} />
  );

export const KanbanFilterItem = <TData,>(
  props: KanbanFilterItemProps<TData>,
) => {
  const { field, state } = props;
  const { filters, dateFilters, filterMenuRef } = state;
  return (
    <div className="gdy-kanban-filter-item">
      <KanbanFilterTrigger
        label={field.header}
        hasFilter={hasColumnFilter(field.id, filters, dateFilters)}
        onToggle={() => state.toggleFilterMenu(field.id)}
      />
      {state.openFilterColumnId === field.id && (
        <FilterMenuHolder className="gdy-kanban-filter-menu-holder" holderRef={filterMenuRef}>
          {renderFieldMenu(props)}
        </FilterMenuHolder>
      )}
    </div>
  );
};
