import type { CellContext } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { useExpandedContentId } from "./expanded-content-id";
import { readInternalColumnMeta } from "../model/internal-column-meta";

// `aria-controls` only while open: the detail is mounted on demand, and a reference to a missing id is invalid.
export const ExpandToggleCell = <TData,>({ row, table }: Pick<CellContext<TData, unknown>, "row" | "table">) => {
  const contentId = useExpandedContentId(row.id);
  const meta = readInternalColumnMeta(table);
  const expansion = meta?.expansion;
  if (!meta || !expansion?.canExpand(row.original)) return null;
  const isExpanded = expansion.isExpanded(row.id);
  return (
    <button
      type="button"
      className="gdy-icon-btn gdy-table-expand-toggle"
      aria-label={meta.labels.expandRow}
      aria-expanded={isExpanded}
      aria-controls={isExpanded ? contentId : undefined}
      onClick={() => expansion.toggleRow(row.id)}
    >
      <ChevronRight size={14} className="gdy-table-expand-chevron" aria-hidden="true" />
    </button>
  );
};
