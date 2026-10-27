import type { TableModel } from "../model/use-table-core";
import type { TableSettings } from "../settings";

// A controlled size the app computes (a height recipe gives 13) may be missing from the options:
// it is listed while active so the select never goes blank. Uncontrolled, the options stay as given.
const resolvePageSizeOptions = <TData>(settings: TableSettings<TData>, pageSize: number) => {
  const options = settings.pageSizeOptions;
  if (settings.pageSize === undefined || options.includes(pageSize)) return options;
  return [...options, pageSize].sort((first, second) => first - second);
};

export const buildPaginationProps = <TData>(model: TableModel<TData>) => {
  const { settings, paging } = model;
  const { range } = paging;
  return {
    enabled: settings.flags.pagination,
    totalRows: range.totalRows,
    from: range.from,
    to: range.to,
    label: settings.label,
    pageSize: paging.pageSize,
    pageSizeOptions: resolvePageSizeOptions(settings, paging.pageSize),
    onPageSizeChange: paging.changePageSize,
    pageIndex: paging.pageIndex,
    pageCount: paging.pageCount,
    onPrevPage: () => paging.goToPage(paging.pageIndex - 1),
    onNextPage: () => paging.goToPage(paging.pageIndex + 1),
    selectTheme: settings.selectTheme,
    className: settings.classNames?.pagination,
  };
};
