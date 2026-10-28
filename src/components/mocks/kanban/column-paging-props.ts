import type { KanbanBoardProps } from "../../kanban";
import type { MockCompanyRow } from "../company/company-rows";
import type { useColumnPaging } from "./use-column-paging";

// Collapsible columns and the paged footer, added in 1.3.0: "Archivada" starts collapsed.
export const buildColumnPagingProps = (
  paging: ReturnType<typeof useColumnPaging>,
): Partial<KanbanBoardProps<MockCompanyRow>> => ({
  data: paging.pagedData,
  onGroupChange: paging.onGroupChange,
  renderColumnFooter: paging.renderColumnFooter,
  collapsibleColumns: true,
  defaultCollapsedColumns: ["Archivada"],
});
