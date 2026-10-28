import type { Row } from "@tanstack/react-table";
import { countRenderedColumns } from "../columns/rendered-columns";
import { useExpandedContentId } from "../expansion/expanded-content-id";
import { useDetailPresence } from "../expansion/use-detail-presence";
import type { ExpandedRowsModel } from "../expansion/use-expanded-rows";
import type { TableModelProps } from "../model/use-table-core";

interface TableExpandedRowProps<TData> extends TableModelProps<TData> {
  row: Row<TData>;
  expansion: ExpandedRowsModel<TData>;
}

// A sibling row, not a child of the data row: keys and clicks inside the detail never reach the row above.
export const TableExpandedRow = <TData,>({ row, expansion, model }: TableExpandedRowProps<TData>) => {
  const isOpen = expansion.isExpanded(row.id);
  const { isRendered, panelRef } = useDetailPresence(isOpen);
  const contentId = useExpandedContentId(row.id);
  if (!isRendered) return null;
  return (
    <tr className="gdy-table-expanded-row">
      <td className="gdy-table-expanded-cell" colSpan={countRenderedColumns(model)}>
        <div ref={panelRef} className="gdy-table-expanded-panel" data-state={isOpen ? "open" : "closed"}>
          <div id={contentId} className="gdy-table-expanded-content">
            <div className="gdy-table-expanded-body">{expansion.renderContent(row.original)}</div>
          </div>
        </div>
      </td>
    </tr>
  );
};
