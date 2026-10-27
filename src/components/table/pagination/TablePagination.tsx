import { cn } from "../../../lib/cn";
import type { SelectTheme } from "../../shared/select-theme";
import type { DataTableLabels } from "../types";
import { PaginationControls } from "./PaginationControls";
import { PaginationSummary } from "./PaginationSummary";

export type PaginationLabels = Pick<DataTableLabels, "showing" | "pageSize" | "pageOf" | "previousPage" | "nextPage">;

export interface TablePaginationProps {
  enabled: boolean;
  totalRows: number;
  from: number;
  to: number;
  label: string;
  labels: PaginationLabels;
  pageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (size: number) => void;
  pageIndex: number;
  pageCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  selectTheme?: SelectTheme;
  className?: string;
}

export const TablePagination = (props: TablePaginationProps) => {
  if (!props.enabled) return null;
  return (
    <div className={cn("gdy-table-pagination", props.className)}>
      <PaginationSummary {...props} />
      <PaginationControls {...props} />
    </div>
  );
};
