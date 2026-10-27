import { SimpleSelect } from "../../ui/select/select";
import type { TablePaginationProps } from "./TablePagination";

const buildPageSizeOptions = (sizes: number[]) =>
  sizes.map((size) => ({ value: String(size), label: String(size) }));

export const PaginationSummary = (props: TablePaginationProps) => {
  const { labels } = props;
  return (
    <div className="gdy-table-pagination-left">
      <span className="gdy-table-pagination-text">
        {labels.showing({ from: props.from, to: props.to, total: props.totalRows, itemsName: props.label })}
      </span>
      <div className="gdy-table-page-size">
        <span className="gdy-table-pagination-text">{labels.pageSize}</span>
        <SimpleSelect
          ariaLabel={labels.pageSize}
          options={buildPageSizeOptions(props.pageSizeOptions)}
          value={String(props.pageSize)}
          onValueChange={(value) => props.onPageSizeChange(Number(value))}
          theme={props.selectTheme}
        />
      </div>
    </div>
  );
};
