import type { DataTableClassNames } from "../../table";
import type { KanbanBoardClassNames } from "../../kanban";

// `?clases=1` shows `classNames` with Tailwind utilities; by default the demos keep their look.
const isClassNamesDemo = () => new URLSearchParams(window.location.search).get("clases") === "1";

// A background goes through the part's token: a gdy-* rule weighs the same as a `bg-*` utility, so the winner
// would depend on stylesheet order. Sticky header cells paint the head background, so the row sets their token.
const TABLE_DEMO_CLASS_NAMES: DataTableClassNames = {
  headRow: "[--gdy-table-head-bg:theme(colors.sky.100)] dark:[--gdy-table-head-bg:theme(colors.sky.950)]",
  row: "even:bg-slate-50 dark:even:bg-slate-900/60",
  pagination: "bg-sky-50/70 dark:bg-sky-950/40",
  empty: "italic",
};

const KANBAN_DEMO_CLASS_NAMES: KanbanBoardClassNames = {
  column: "[--gdy-kanban-column-bg:theme(colors.sky.50)] dark:[--gdy-kanban-column-bg:theme(colors.sky.950)]",
  columnHead: "uppercase tracking-wide",
  card: "shadow-md ring-1 ring-sky-200 dark:ring-sky-800",
  empty: "italic",
};

export const readTableDemoClassNames = () => (isClassNamesDemo() ? TABLE_DEMO_CLASS_NAMES : undefined);

export const readKanbanDemoClassNames = () => (isClassNamesDemo() ? KANBAN_DEMO_CLASS_NAMES : undefined);
