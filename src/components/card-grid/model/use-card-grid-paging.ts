import { useMemo } from "react";
import type { useViewControls } from "../../shared/controls/use-view-controls";
import { computePageRange } from "../../table/pagination/page-range";
import { usePagedRows } from "../../table/pagination/use-paged-rows";
import { useResetPageOnChange } from "../../table/pagination/use-reset-page-on-change";
import { useTablePagination } from "../../table/pagination/use-table-pagination";
import type { CardGridSettings } from "../settings";

type ViewControls = ReturnType<typeof useViewControls>;

// One memoized object for the values whose change sends the grid back to the first page, as in the table.
const useViewSnapshot = ({ search, filters, dateFilters, sorting, archivedMode }: ViewControls) =>
  useMemo(
    () => ({ search, filters, dateFilters, sorting, archivedMode }),
    [search, filters, dateFilters, sorting, archivedMode],
  );

export const useCardGridPaging = <TData>(
  visibleRows: TData[],
  settings: CardGridSettings<TData>,
  controls: ViewControls,
) => {
  const navigation = useTablePagination(visibleRows.length, settings);
  useResetPageOnChange(navigation, settings, useViewSnapshot(controls));
  const pageRows = usePagedRows(visibleRows, navigation, settings);
  const range = computePageRange(visibleRows.length, navigation, settings);
  return { ...navigation, pageRows, range };
};
