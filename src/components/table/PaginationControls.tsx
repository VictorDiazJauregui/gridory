import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageStepButton } from "./PageStepButton";
import type { TablePaginationProps } from "./TablePagination";

export const PaginationControls = (props: TablePaginationProps) => {
  const { pageIndex, pageCount } = props;
  return (
    <div className="gdy-table-pagination-right">
      <span className="gdy-table-pagination-text">
        Página {props.totalRows === 0 ? 0 : pageIndex + 1} de {pageCount}
      </span>
      <PageStepButton
        icon={ChevronLeft}
        disabled={pageIndex <= 0}
        onClick={props.onPrevPage}
      />
      <PageStepButton
        icon={ChevronRight}
        disabled={pageIndex + 1 >= pageCount}
        onClick={props.onNextPage}
      />
    </div>
  );
};
