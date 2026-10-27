import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageStepButton } from "./PageStepButton";
import type { TablePaginationProps } from "./TablePagination";

export const PaginationControls = (props: TablePaginationProps) => {
  const { pageIndex, pageCount, labels } = props;
  const page = props.totalRows === 0 ? 0 : pageIndex + 1;
  return (
    <div className="gdy-table-pagination-right">
      <span className="gdy-table-pagination-text">{labels.pageOf(page, pageCount)}</span>
      <PageStepButton icon={ChevronLeft} label={labels.previousPage} disabled={pageIndex <= 0} onClick={props.onPrevPage} />
      <PageStepButton
        icon={ChevronRight}
        label={labels.nextPage}
        disabled={pageIndex + 1 >= pageCount}
        onClick={props.onNextPage}
      />
    </div>
  );
};
