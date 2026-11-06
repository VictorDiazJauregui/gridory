import type { ArchivedViewConfig } from "../data-model";
import type { DataViewStateProps } from "../data-view-state-props";
import { useControllableState } from "../state/use-controllable-state";
import { useArchivedMode } from "./use-archived-mode";
import { useColumnFilters } from "./use-column-filters";
import { useColumnSorting } from "./use-column-sorting";

interface ViewControlsProps extends DataViewStateProps {
  archivedView?: ArchivedViewConfig;
}

export const useViewControls = (props: ViewControlsProps) => {
  const [search, setSearch] = useControllableState({
    value: props.search,
    defaultValue: "",
    onChange: props.onSearchChange,
    name: "search",
  });
  const sorting = useColumnSorting({ value: props.sorting, onChange: props.onSortChange });
  const columnFilters = useColumnFilters({ value: props.columnFilters, onChange: props.onFiltersChange });
  const archived = useArchivedMode(props.archivedView);
  return { search, setSearch, ...sorting, ...columnFilters, ...archived };
};
