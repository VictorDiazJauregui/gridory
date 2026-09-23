import { useState } from "react";
import { useArchivedMode } from "../../shared/use-archived-mode";
import { useColumnFilters } from "../../shared/use-column-filters";
import { useColumnSorting } from "../../shared/use-column-sorting";
import type { KanbanBoardProps } from "../types";

export const useBoardControls = <TData>({
  archivedView,
}: KanbanBoardProps<TData>) => {
  const [search, setSearch] = useState("");
  const sorting = useColumnSorting();
  const columnFilters = useColumnFilters();
  const archived = useArchivedMode(archivedView);
  return { search, setSearch, ...sorting, ...columnFilters, ...archived };
};
