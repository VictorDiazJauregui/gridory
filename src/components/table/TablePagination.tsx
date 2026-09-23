import { ChevronLeft, ChevronRight } from "lucide-react";
import { SimpleSelect } from "../ui/select";
import type { SelectTheme } from "../shared/select-theme";

interface TablePaginationProps {
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

export const TablePagination = ({
  enabled,
  totalRows,
  from,
  to,
  label,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  pageIndex,
  pageCount,
  onPrevPage,
  onNextPage,
  selectTheme,
}: TablePaginationProps) => {
  if (!enabled) return null;

  return (
    <div className="gdy-table-pagination">
      <div className="gdy-table-pagination-left">
        <span className="gdy-table-pagination-text">
          {totalRows === 0
            ? `0 ${label}`
            : `Mostrando ${from}–${to} de ${totalRows} ${label}`}
        </span>
        <div className="gdy-table-page-size">
          <span className="gdy-table-pagination-text">Elementos por página</span>
          <SimpleSelect
            ariaLabel="Elementos por página"
            options={pageSizeOptions.map((size) => ({
              value: String(size),
              label: String(size),
            }))}
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
            theme={selectTheme}
          />
        </div>
      </div>

      <div className="gdy-table-pagination-right">
        <span className="gdy-table-pagination-text">
          Página {totalRows === 0 ? 0 : pageIndex + 1} de {pageCount}
        </span>
        <button
          type="button"
          className="gdy-icon-btn"
          disabled={pageIndex <= 0}
          onClick={onPrevPage}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="gdy-icon-btn"
          disabled={pageIndex + 1 >= pageCount}
          onClick={onNextPage}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
