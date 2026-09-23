import type { TableModel } from "./use-table-core";

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
    pageSizeOptions: settings.pageSizeOptions,
    onPageSizeChange: paging.changePageSize,
    pageIndex: paging.pageIndex,
    pageCount: paging.pageCount,
    onPrevPage: () => paging.goToPage(paging.pageIndex - 1),
    onNextPage: () => paging.goToPage(paging.pageIndex + 1),
    selectTheme: settings.selectTheme,
  };
};
