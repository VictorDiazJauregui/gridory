import { SimpleSelect } from "../../ui/select/select";
import type { TablePaginationProps } from "./TablePagination";

const formatPageSummary = ({
  totalRows,
  from,
  to,
  label,
}: TablePaginationProps) =>
  totalRows === 0
    ? `0 ${label}`
    : `Mostrando ${from}–${to} de ${totalRows} ${label}`;

const buildPageSizeOptions = (sizes: number[]) =>
  sizes.map((size) => ({ value: String(size), label: String(size) }));

export const PaginationSummary = (props: TablePaginationProps) => (
  <div className="gdy-table-pagination-left">
    <span className="gdy-table-pagination-text">{formatPageSummary(props)}</span>
    <div className="gdy-table-page-size">
      <span className="gdy-table-pagination-text">Elementos por página</span>
      <SimpleSelect
        ariaLabel="Elementos por página"
        options={buildPageSizeOptions(props.pageSizeOptions)}
        value={String(props.pageSize)}
        onValueChange={(value) => props.onPageSizeChange(Number(value))}
        theme={props.selectTheme}
      />
    </div>
  </div>
);
