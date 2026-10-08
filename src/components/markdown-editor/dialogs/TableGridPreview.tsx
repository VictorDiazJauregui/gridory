import type { CSSProperties } from "react";
import type { TableAlignment } from "./dialog-types";

interface TableGridPreviewProps {
  rows: number;
  columns: number;
  alignment: TableAlignment;
  label: string;
}

export const TableGridPreview = ({ rows, columns, alignment, label }: TableGridPreviewProps) => {
  const cells = Array.from({ length: (rows + 1) * columns }, (_, index) => index);
  const gridStyle = { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } as CSSProperties;
  return (
    <figure className="gdy-md-table-preview" aria-label={label} data-alignment={alignment}>
      <div className="gdy-md-table-preview-grid" style={gridStyle}>
        {cells.map((index) => (
          <span key={index} className="gdy-md-table-preview-cell" data-header={index < columns || undefined}>
            <span className="gdy-md-table-preview-line" />
          </span>
        ))}
      </div>
      <figcaption className="gdy-md-dialog-hint">{`${rows} × ${columns}`}</figcaption>
    </figure>
  );
};
