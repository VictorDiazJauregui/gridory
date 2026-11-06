import { resolvePageSizeOptions } from "../../table/pagination/pagination-props";
import type { TablePaginationProps } from "../../table/pagination/TablePagination";
import type { CardGridModel } from "../model/use-card-grid-model";

export const buildCardGridPaginationProps = <TData>({ settings, paging }: CardGridModel<TData>): TablePaginationProps => ({
  enabled: settings.flags.pagination,
  totalRows: paging.range.totalRows,
  from: paging.range.from,
  to: paging.range.to,
  label: settings.labels.itemsName,
  labels: settings.labels,
  pageSize: paging.pageSize,
  pageSizeOptions: resolvePageSizeOptions(settings, paging.pageSize),
  onPageSizeChange: paging.changePageSize,
  pageIndex: paging.pageIndex,
  pageCount: paging.pageCount,
  onPrevPage: () => paging.goToPage(paging.pageIndex - 1),
  onNextPage: () => paging.goToPage(paging.pageIndex + 1),
  selectTheme: settings.selectTheme,
  className: settings.classNames?.pagination,
});
