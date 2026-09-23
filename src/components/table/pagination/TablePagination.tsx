import type { SelectTheme } from "../../shared/select-theme";
import { PaginationControls } from "./PaginationControls";
import { PaginationSummary } from "./PaginationSummary";

export interface TablePaginationProps {
  enabled: boolean;
  totalRows: number;
  from: number;
  to: number;
  label: string;
  pageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (size: number) => void;
  pageIndex: number;
  pageCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  selectTheme?: SelectTheme;
}

export const TablePagination = (props: TablePaginationProps) => {
  if (!props.enabled) return null;
  return (
    <div className="gdy-table-pagination">
      <PaginationSummary {...props} />
      <PaginationControls {...props} />
    </div>
  );
};
