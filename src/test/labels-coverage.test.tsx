import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { KanbanBoard } from "../components/kanban";
import { KANBAN_BOARD_LABELS } from "../components/kanban/labels";
import type { KanbanBoardLabels } from "../components/kanban/types";
import { DataTable } from "../components/table";
import { DATA_TABLE_LABELS } from "../components/table/labels";
import type { DataTableLabels } from "../components/table/types";

// Every label becomes a marker and every consumer text starts with "§": once the menus are open,
// any other visible text came from neither, so it was written in the code.
interface CoverageRow {
  id: string;
  name: string;
  status: string;
  since: string;
}

const ROWS: CoverageRow[] = [
  { id: "r1", name: "§Alfa", status: "§Activa", since: "2026-03-01" },
  { id: "r2", name: "", status: "", since: "2026-01-15" },
];

const COLUMNS = [
  { id: "name", header: "§Nombre", accessor: (row: CoverageRow) => row.name, sortable: true, filterable: true },
  {
    id: "status",
    header: "§Estado",
    accessor: (row: CoverageRow) => row.status,
    filterable: true,
    inlineEditOptions: [{ value: "§Otra", label: "§Otra" }],
    onInlineEdit: () => {},
  },
  { id: "since", header: "§Alta", accessor: (row: CoverageRow) => row.since, type: "date" as const, filterable: true },
];

const ROW_ACTIONS = {
  getIsArchived: (row: CoverageRow) => row.status === "",
  onEdit: () => {},
  onArchiveToggle: () => {},
  onRemove: () => {},
  onHistory: () => {},
};

const VIEW_PROPS = {
  data: ROWS,
  rowActions: ROW_ACTIONS,
  archivedView: { defaultValue: "all" as const },
  viewSwitch: { active: "table" as const, onChange: () => {} },
  aiButton: { onClick: () => {} },
  onCreate: () => {},
};

const toMarkers = <TLabels extends object>(defaults: TLabels) =>
  Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [key, typeof value === "function" ? () => `⟦${key}⟧` : `⟦${key}⟧`]),
  ) as TLabels;

// Numbers, counts and the "—" of an empty cell are not texts; the date mask placeholder comes from
// the `dateInputFormat` prop.
const IS_ALLOWED = /⟦\w+⟧|§|^[\d\s.,:/()–—-]*$|^[dmy/.-]+$/;
const TEXT_ATTRIBUTES = ["aria-label", "title", "placeholder"];

const isOutsideCalendar = (node: Node) => !node.parentElement?.closest(".gdy-calendar-root");

const collectTexts = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const texts: string[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (isOutsideCalendar(node)) texts.push(node.textContent ?? "");
  }
  const elements = [...document.body.querySelectorAll("*")].filter((element) => !element.closest(".gdy-calendar-root"));
  const attributes = elements.flatMap((element) => TEXT_ATTRIBUTES.map((name) => element.getAttribute(name) ?? ""));
  return [...texts, ...attributes].map((text) => text.trim()).filter(Boolean);
};

const expectOnlyLabelsAndData = () => expect(collectTexts().filter((text) => !IS_ALLOWED.test(text))).toEqual([]);

const openDateMenu = (header: string, between: string) => {
  fireEvent.click(screen.getByRole("button", { name: header }));
  fireEvent.click(within(document.querySelector(".gdy-panel") as HTMLElement).getByText(between));
};

test("every visible text of the table comes from labels or from the consumer", () => {
  const labels = toMarkers<DataTableLabels>(DATA_TABLE_LABELS);
  render(<DataTable {...VIEW_PROPS} columns={COLUMNS} getRowId={(row) => row.id} groupableColumnIds={["status"]} labels={labels} />);
  expectOnlyLabelsAndData();
  fireEvent.click(screen.getByRole("button", { name: "§Estado" }));
  expectOnlyLabelsAndData();
  openDateMenu("§Alta", "⟦operatorBetween⟧");
  expectOnlyLabelsAndData();
  fireEvent.keyDown(screen.getAllByRole("button", { name: "⟦rowActionsTrigger⟧" })[0], { key: "Enter" });
  expectOnlyLabelsAndData();
});

test("every visible text of the empty table comes from labels", () => {
  render(<DataTable {...VIEW_PROPS} data={[]} columns={COLUMNS} getRowId={(row) => row.id} labels={toMarkers(DATA_TABLE_LABELS)} />);
  expectOnlyLabelsAndData();
});

test("every visible text of the kanban comes from labels or from the consumer", () => {
  const labels = toMarkers<KanbanBoardLabels>(KANBAN_BOARD_LABELS);
  const group = {
    id: "status",
    label: "§Estado",
    accessor: (row: CoverageRow) => row.status,
    setValue: (row: CoverageRow, status: string) => ({ ...row, status }),
    values: [{ value: "§Nueva", label: "§Nueva" }],
  };
  render(
    <KanbanBoard {...VIEW_PROPS} fields={COLUMNS} groups={[group]} defaultGroupId="status" getCardId={(row) => row.id} labels={labels} />,
  );
  expectOnlyLabelsAndData();
  fireEvent.click(screen.getByRole("button", { name: "§Estado" }));
  expectOnlyLabelsAndData();
  openDateMenu("§Alta", "⟦operatorAfter⟧");
  expectOnlyLabelsAndData();
  fireEvent.keyDown(screen.getAllByRole("button", { name: "⟦rowActionsTrigger⟧" })[0], { key: "Enter" });
  expectOnlyLabelsAndData();
});
