import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";
import { DataTable, MissingRowIdError, type DataTableProps } from "../components/table";
import { toggleExpandedId } from "../components/table/expansion/expanded-rows";
import { BASELINE_COLUMNS, BASELINE_ROW_ACTIONS, type BaselineRow } from "./baseline-fixture";
import { expectRenderError } from "./expect-render-error";

const ROWS: BaselineRow[] = Array.from({ length: 6 }, (_, index) => ({
  id: `r${index + 1}`,
  name: `Empresa ${index + 1}`,
  country: index % 2 === 0 ? "Perú" : "Chile",
  status: index === 5 ? "Archivada" : "Activa",
}));

type Props = Partial<DataTableProps<BaselineRow>>;

const renderDetail = (row: BaselineRow) => <p>Detalle de {row.name}</p>;

const renderTable = (props: Props = {}) =>
  render(
    <DataTable
      columns={BASELINE_COLUMNS}
      data={ROWS}
      getRowId={(row) => row.id}
      defaultPageSize={2}
      renderExpandedRow={renderDetail}
      {...props}
    />,
  ).container;

const expandButton = (rowId: string) =>
  within(document.querySelector(`[data-row-id="${rowId}"]`) as HTMLElement).getByRole("button", { name: "Mostrar detalle" });
const detailRows = (container: HTMLElement) => [...container.querySelectorAll("tr.gdy-table-expanded-row")];
const nextPage = (container: HTMLElement) =>
  fireEvent.click([...container.querySelectorAll(".gdy-table-pagination button")].at(-1) as Element);
const previousPage = (container: HTMLElement) =>
  fireEvent.click([...container.querySelectorAll(".gdy-table-pagination button")].at(-2) as Element);

afterEach(() => vi.restoreAllMocks());

test("without renderExpandedRow there is no expand column, no detail row and no expansion attribute", () => {
  const container = renderTable({
    renderExpandedRow: undefined,
    defaultExpandedRowIds: ["r1"],
    getRowAttributes: () => ({ "data-expanded": "consumer" }),
  });
  expect(container.querySelector('[data-column-id="_expand"]')).toBeNull();
  expect(detailRows(container)).toHaveLength(0);
  expect(container.querySelector('[data-row-id="r1"]')).toHaveAttribute("data-expanded", "consumer");
});

test("renderExpandedRow without getRowId throws MissingRowIdError", () => {
  expectRenderError(<DataTable columns={BASELINE_COLUMNS} data={ROWS} renderExpandedRow={renderDetail} />, MissingRowIdError);
  expect(new MissingRowIdError("renderExpandedRow").message).toMatch(/^renderExpandedRow needs getRowId/);
  expect(new MissingRowIdError().message).toMatch(/^rowSelection needs getRowId/);
});

test("the expand column goes after the checkbox column and before the data columns", () => {
  const container = renderTable({ rowSelection: {} });
  const ids = [...container.querySelectorAll("thead th")].map((cell) => cell.getAttribute("data-column-id"));
  expect(ids.slice(0, 3)).toEqual(["_select", "_expand", "name"]);
  expect(container.querySelector('th[data-column-id="_expand"]')).toBeEmptyDOMElement();
});

test("the button opens a full-width detail right after its row and closes it", async () => {
  const onExpandedChange = vi.fn();
  const container = renderTable({ onExpandedChange });
  const button = expandButton("r1");
  expect(button).toHaveAttribute("aria-expanded", "false");
  expect(button).not.toHaveAttribute("aria-controls");
  fireEvent.click(button);
  expect(onExpandedChange).toHaveBeenLastCalledWith(["r1"]);
  const row = container.querySelector('[data-row-id="r1"]') as HTMLElement;
  expect(row).toHaveAttribute("data-expanded");
  expect(button).toHaveAttribute("aria-expanded", "true");
  const detail = row.nextElementSibling as HTMLElement;
  expect(detail).toHaveClass("gdy-table-expanded-row");
  expect(detail.querySelector("td")).toHaveAttribute("colspan", String(container.querySelectorAll("thead th").length));
  expect(document.getElementById(button.getAttribute("aria-controls") as string)).toHaveTextContent("Detalle de Empresa 1");
  fireEvent.click(button);
  expect(onExpandedChange).toHaveBeenLastCalledWith([]);
  expect(row).not.toHaveAttribute("data-expanded");
  await waitFor(() => expect(detailRows(container)).toHaveLength(0));
});

test("Enter and Space on the focused button toggle the detail", async () => {
  const user = userEvent.setup();
  const container = renderTable();
  expandButton("r2").focus();
  await user.keyboard("{Enter}");
  expect(detailRows(container)).toHaveLength(1);
  await user.keyboard(" ");
  expect(expandButton("r2")).toHaveAttribute("aria-expanded", "false");
});

test("controlled: the details follow expandedRowIds and onExpandedChange reports the next ids", () => {
  const onExpandedChange = vi.fn();
  const container = renderTable({ expandedRowIds: ["r2"], onExpandedChange });
  expect(detailRows(container)).toHaveLength(1);
  fireEvent.click(expandButton("r1"));
  expect(onExpandedChange).toHaveBeenLastCalledWith(["r2", "r1"]);
  expect(expandButton("r1")).toHaveAttribute("aria-expanded", "false");
});

test("controlled from a parent that keeps the ids", () => {
  const Parent = () => {
    const [ids, setIds] = useState<string[]>([]);
    return (
      <DataTable
        columns={BASELINE_COLUMNS}
        data={ROWS}
        getRowId={(row) => row.id}
        renderExpandedRow={renderDetail}
        expandedRowIds={ids}
        onExpandedChange={setIds}
      />
    );
  };
  render(<Parent />);
  fireEvent.click(expandButton("r3"));
  expect(screen.getByText("Detalle de Empresa 3")).toBeInTheDocument();
});

test("defaultExpandedRowIds opens those rows on mount", () => {
  renderTable({ defaultExpandedRowIds: ["r1", "r2"] });
  expect(screen.getByText("Detalle de Empresa 1")).toBeInTheDocument();
  expect(screen.getByText("Detalle de Empresa 2")).toBeInTheDocument();
});

test("a row canExpandRow rejects has no button and no detail, even when its id is open", () => {
  const container = renderTable({ defaultExpandedRowIds: ["r2"], canExpandRow: (row) => row.id !== "r2" });
  const cell = container.querySelector('[data-row-id="r2"] td[data-column-id="_expand"]');
  expect(cell).toBeEmptyDOMElement();
  expect(container.querySelector('[data-row-id="r2"]')).not.toHaveAttribute("data-expanded");
  expect(detailRows(container)).toHaveLength(0);
});

test("the button never reaches onRowClick; the rest of the row does", () => {
  const onRowClick = vi.fn();
  const container = renderTable({ onRowClick });
  fireEvent.click(expandButton("r1"));
  expect(onRowClick).not.toHaveBeenCalled();
  fireEvent.click(container.querySelector('[data-row-id="r1"] td[data-column-id="name"]') as Element);
  expect(onRowClick).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByText("Detalle de Empresa 1"));
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test("a detail is not a row: the page, its summary and onVisibleRowsChange stay the same", () => {
  const onVisibleRowsChange = vi.fn();
  const container = renderTable({ onVisibleRowsChange });
  const summary = () => container.querySelector(".gdy-table-pagination")?.textContent;
  const before = summary();
  onVisibleRowsChange.mockClear();
  fireEvent.click(expandButton("r1"));
  expect(summary()).toBe(before);
  expect(container.querySelectorAll("tbody tr.gdy-table-row")).toHaveLength(2);
  expect(onVisibleRowsChange).not.toHaveBeenCalled();
});

test("open rows stay open across pages", () => {
  const container = renderTable();
  fireEvent.click(expandButton("r1"));
  nextPage(container);
  expect(detailRows(container)).toHaveLength(0);
  previousPage(container);
  expect(screen.getByText("Detalle de Empresa 1")).toBeInTheDocument();
});

test("a collapsed group hides the detail with its row, and the detail spans the columns on screen", () => {
  const container = renderTable({
    defaultPageSize: 10,
    groupableColumnIds: ["status"],
    defaultGroupBy: "status",
    columnVisibility: { country: false },
    defaultExpandedRowIds: ["r1"],
  });
  const span = container.querySelector(".gdy-table-expanded-cell")?.getAttribute("colspan");
  expect(span).toBe(String(container.querySelectorAll("thead th").length));
  fireEvent.click(screen.getByRole("button", { name: /Activa/ }));
  expect(detailRows(container)).toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: /Activa/ }));
  expect(screen.getByText("Detalle de Empresa 1")).toBeInTheDocument();
});

test("getRowAttributes cannot overwrite data-expanded while renderExpandedRow is set", () => {
  const container = renderTable({ getRowAttributes: () => ({ "data-expanded": "consumer", "data-kind": "company" }) });
  const row = container.querySelector('[data-row-id="r1"]');
  expect(row).not.toHaveAttribute("data-expanded");
  expect(row).toHaveAttribute("data-kind", "company");
});

test("labels.expandRow renames the button", () => {
  renderTable({ labels: { expandRow: "Show details" } });
  expect(screen.getAllByRole("button", { name: "Show details" })).toHaveLength(2);
});

test("while loading, the skeleton has an expand cell and no detail", () => {
  const container = renderTable({ loading: true, defaultExpandedRowIds: ["r1"] });
  expect(container.querySelector('.gdy-table-skeleton[data-column-id="_expand"]')).not.toBeNull();
  expect(detailRows(container)).toHaveLength(0);
});

test("a nested table renders inside the detail without the outer table's columns or attributes", () => {
  const container = renderTable({
    rowActions: BASELINE_ROW_ACTIONS,
    rowSelection: {},
    defaultExpandedRowIds: ["r1"],
    renderExpandedRow: (row) => (
      <DataTable columns={BASELINE_COLUMNS} data={[row]} features={{ search: false, pagination: false }} />
    ),
  });
  const nested = container.querySelector(".gdy-table-expanded-content .gdy-table") as HTMLElement;
  expect(nested.querySelectorAll("tbody tr.gdy-table-row")).toHaveLength(1);
  expect(nested.querySelector('[data-column-id^="_"]')).toBeNull();
  expect(nested.querySelector("[data-expanded], [data-selected]")).toBeNull();
});

test("an open detail stays rendered while printing", () => {
  const container = renderTable({ printMode: "page", defaultExpandedRowIds: ["r1"] });
  act(() => window.dispatchEvent(new Event("beforeprint")));
  expect(detailRows(container)).toHaveLength(1);
});

test("toggleExpandedId adds a missing id at the end and removes a present one", () => {
  expect(toggleExpandedId(["a"], "b")).toEqual(["a", "b"]);
  expect(toggleExpandedId(["a", "b"], "a")).toEqual(["b"]);
});
