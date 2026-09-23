import { FilterMenu } from "../../shared/toolbar";
import { buildFilterSortProps } from "./filter-item";
import type { KanbanFilterItemProps } from "./filter-item";

export const KanbanValueFilterMenu = <TData,>(
  props: KanbanFilterItemProps<TData>,
) => {
  const { field, state } = props;
  return (
    <FilterMenu
      options={state.filterOptions[field.id] ?? []}
      selected={state.filters[field.id] ?? []}
      onSelectedChange={(next) => state.setFilter(field.id, next)}
      {...buildFilterSortProps(props, state.toggleColumnSort)}
    />
  );
};
