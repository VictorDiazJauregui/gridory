import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";
import { DataTable, MissingRowIdError, type DataTableProps } from "../components/table";
import { pruneMissingIds, resolveHeaderCheckState, toggleScopeIds } from "../components/table/selection/row-selection";
import { BASELINE_COLUMNS, type BaselineRow } from "./baseline-fixture";
import { expectRenderError } from "./expect-render-error";

const ROWS: BaselineRow[] = Array.from({ length: 6 }, (_, index) => ({
  id: `r${index + 1}`,
  name: `Empresa ${index + 1}`,
  country: index % 2 === 0 ? "Perú" : "Chile",
  status: index === 5 ? "Archivada" : "Activa",
}));

type Props = Partial<DataTableProps<BaselineRow>>;

const renderTable = (props: Props = {}) =>
  render(
    <DataTable columns={BASELINE_COLUMNS} data={ROWS} getRowId={(row) => row.id} defaultPageSize={2} {...props} />,
  ).container;

const rowCheckbox = (name: string) =>
  within(screen.getByRole("row", { name: new RegExp(name) })).getByRole("checkbox", { name: "Seleccionar fila" });
const pageCheckbox = () => screen.getByRole("checkbox", { name: "Seleccionar las filas de la página" });
const nextPage = (container: HTMLElement) =>
  fireEvent.click([...container.querySelectorAll(".gdy-table-pagination button")].at(-1) as Element);

afterEach(() => vi.restoreAllMocks());

test("without rowSelection there is no checkbox column and no selection attribute", () => {
  const container = renderTable();
  expect(container.querySelector('[data-column-id="_select"]')).toBeNull();
  expect(container.querySelector("[aria-selected], [data-selected]")).toBeNull();
});

test("rowSelection without getRowId throws MissingRowIdError", () => {
  expectRenderError(<DataTable columns={BASELINE_COLUMNS} data={ROWS} rowSelection={{}} />, MissingRowIdError);
});

test("the checkbox column goes first and a click selects the row", () => {
  const onChange = vi.fn();
  const container = renderTable({ rowSelection: { onChange } });
  expect(container.querySelector("th")).toHaveAttribute("data-column-id", "_select");
  fireEvent.click(rowCheckbox("Empresa 1"));
  expect(onChange).toHaveBeenLastCalledWith(["r1"]);
  const row = container.querySelector('[data-row-id="r1"]');
  expect(row).toHaveAttribute("data-selected");
  expect(row).toHaveAttribute("aria-selected", "true");
  expect(container.querySelector('[data-row-id="r2"]')).toHaveAttribute("aria-selected", "false");
});

test("controlled: the rows follow selectedIds and onChange reports the next ids", () => {
  const onChange = vi.fn();
  renderTable({ rowSelection: { selectedIds: ["r2"], onChange } });
  expect(rowCheckbox("Empresa 2")).toHaveAttribute("aria-checked", "true");
  fireEvent.click(rowCheckbox("Empresa 1"));
  expect(onChange).toHaveBeenLastCalledWith(["r2", "r1"]);
  expect(rowCheckbox("Empresa 1")).toHaveAttribute("aria-checked", "false");
});

test('the header checkbox is "mixed" with a partial page and marks the whole page', () => {
  const onChange = vi.fn();
  renderTable({ rowSelection: { defaultSelectedIds: ["r1"], onChange } });
  expect(pageCheckbox()).toHaveAttribute("aria-checked", "mixed");
  fireEvent.click(pageCheckbox());
  expect(onChange).toHaveBeenLastCalledWith(["r1", "r2"]);
  fireEvent.click(pageCheckbox());
  expect(onChange).toHaveBeenLastCalledWith([]);
});

test('"filtered" marks every row that passes search and filters, not only the page', () => {
  const onChange = vi.fn();
  renderTable({ rowSelection: { selectAllScope: "filtered", onChange } });
  fireEvent.click(screen.getByRole("checkbox", { name: "Seleccionar todas las filas filtradas" }));
  expect(onChange).toHaveBeenLastCalledWith(["r1", "r2", "r3", "r4", "r5", "r6"]);
});

test("rows that are not selectable are disabled and left out of the header checkbox", () => {
  const onChange = vi.fn();
  renderTable({
    defaultPageSize: 50,
    rowSelection: { selectAllScope: "filtered", onChange, isRowSelectable: (row) => row.status !== "Archivada" },
  });
  expect(rowCheckbox("Empresa 6")).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox", { name: "Seleccionar todas las filas filtradas" }));
  expect(onChange).toHaveBeenLastCalledWith(["r1", "r2", "r3", "r4", "r5"]);
  expect(screen.getByRole("checkbox", { name: "Seleccionar todas las filas filtradas" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
});

test("the selection survives a page change", () => {
  const container = renderTable({ rowSelection: {} });
  fireEvent.click(rowCheckbox("Empresa 1"));
  nextPage(container);
  expect(pageCheckbox()).toHaveAttribute("aria-checked", "false");
  fireEvent.click([...container.querySelectorAll(".gdy-table-pagination button")].at(-2) as Element);
  expect(rowCheckbox("Empresa 1")).toHaveAttribute("aria-checked", "true");
});

const PrunedTable = ({ onChange }: { onChange: (ids: string[]) => void }) => {
  const [rows, setRows] = useState(ROWS);
  return (
    <>
      <button type="button" onClick={() => setRows(ROWS.slice(1))}>
        quitar
      </button>
      <DataTable
        columns={BASELINE_COLUMNS}
        data={rows}
        getRowId={(row) => row.id}
        rowSelection={{ defaultSelectedIds: ["r1", "r2"], onChange }}
      />
    </>
  );
};

test("ids that leave data are dropped from the selection", () => {
  const onChange = vi.fn();
  render(<PrunedTable onChange={onChange} />);
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "quitar" }));
  expect(onChange).toHaveBeenLastCalledWith(["r2"]);
});

test("manualPagination keeps ids missing from data and treats \"filtered\" as the page, with a warning", () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const onChange = vi.fn();
  render(
    <DataTable
      columns={BASELINE_COLUMNS}
      data={ROWS.slice(0, 2)}
      getRowId={(row) => row.id}
      manualPagination
      serverRowCount={6}
      rowSelection={{ defaultSelectedIds: ["r5"], selectAllScope: "filtered", onChange }}
    />,
  );
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(pageCheckbox());
  expect(onChange).toHaveBeenLastCalledWith(["r5", "r1", "r2"]);
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('"filtered" acts as "page"'));
});

test("a click on the checkbox never fires onRowClick; the rest of the row does", () => {
  const onRowClick = vi.fn();
  renderTable({ rowSelection: {}, onRowClick });
  fireEvent.click(rowCheckbox("Empresa 1"));
  expect(onRowClick).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("Empresa 1"));
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test("Space toggles the selection of a focused row; a row that cannot take focus is not focusable", () => {
  const onChange = vi.fn();
  const container = renderTable({ rowSelection: { onChange }, onRowClick: () => {}, focusableRows: true });
  const row = container.querySelector('[data-row-id="r1"]') as HTMLElement;
  fireEvent.keyDown(row, { key: " " });
  expect(onChange).toHaveBeenLastCalledWith(["r1"]);
  const plainRow = renderTable({ rowSelection: {} }).querySelector('[data-row-id="r1"]');
  expect(plainRow).not.toHaveAttribute("tabindex");
});

test("getRowAttributes cannot overwrite data-selected or aria-selected", () => {
  const container = renderTable({
    rowSelection: { defaultSelectedIds: ["r1"] },
    getRowAttributes: () => ({ "data-selected": false, "aria-selected": "false", "data-kind": "x" }),
  });
  const row = container.querySelector('[data-row-id="r1"]');
  expect(row).toHaveAttribute("data-selected");
  expect(row).toHaveAttribute("aria-selected", "true");
  expect(row).toHaveAttribute("data-kind", "x");
});

test("without rowSelection a consumer data-selected still reaches the row", () => {
  const container = renderTable({ getRowAttributes: () => ({ "data-selected": "yes" }) });
  expect(container.querySelector('[data-row-id="r1"]')).toHaveAttribute("data-selected", "yes");
});

test("labels replace the accessible names", () => {
  renderTable({ rowSelection: {}, labels: { selectRow: "Select row", selectPageRows: "Select page" } });
  expect(screen.getAllByRole("checkbox", { name: "Select row" })).toHaveLength(2);
  expect(screen.getByRole("checkbox", { name: "Select page" })).toBeInTheDocument();
});

test("with printMode the selection prints as text; without it there is no print text", () => {
  const container = renderTable({ rowSelection: { defaultSelectedIds: ["r1"] }, printMode: "page" });
  const texts = [...container.querySelectorAll(".gdy-table-print-value")].map((node) => node.textContent);
  expect(texts).toEqual(["Seleccionada", "Sí", "No"]);
  expect(renderTable({ rowSelection: {} }).querySelector(".gdy-table-print-value")).toBeNull();
});

test("printValue prints its text before the cell content, only with printMode", () => {
  const columns = BASELINE_COLUMNS.map((column) =>
    column.id === "status" ? { ...column, printValue: (row: BaselineRow) => `[${row.status}]` } : column,
  );
  const container = renderTable({ columns, printMode: "page" });
  const cell = container.querySelector('[data-row-id="r1"] [data-column-id="status"]') as HTMLElement;
  expect(cell.firstElementChild).toHaveClass("gdy-table-print-value");
  expect(cell.firstElementChild).toHaveTextContent("[Activa]");
  expect(renderTable({ columns }).querySelector(".gdy-table-print-value")).toBeNull();
});

test("the header checkbox is disabled while there is no row to select", () => {
  render(<DataTable columns={BASELINE_COLUMNS} data={[]} getRowId={(row) => row.id} rowSelection={{}} />);
  expect(pageCheckbox()).toBeDisabled();
});

test("selection helpers: header state, scope toggle and pruning", () => {
  expect(resolveHeaderCheckState(["a", "b"], new Set(["a"]))).toBe("indeterminate");
  expect(resolveHeaderCheckState(["a"], new Set(["a"]))).toBe(true);
  expect(resolveHeaderCheckState([], new Set())).toBe(false);
  expect(toggleScopeIds(["x", "a"], ["a", "b"])).toEqual(["x", "a", "b"]);
  expect(toggleScopeIds(["x", "a", "b"], ["a", "b"])).toEqual(["x"]);
  const ids = ["a", "b"];
  expect(pruneMissingIds(ids, new Set(["a", "b"]))).toBe(ids);
  expect(pruneMissingIds(ids, new Set(["b"]))).toEqual(["b"]);
});

test("the controlled selection does not loop when the app echoes onChange back", () => {
  const ControlledTable = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>(["r1"]);
    return (
      <DataTable
        columns={BASELINE_COLUMNS}
        data={ROWS}
        getRowId={(row) => row.id}
        rowSelection={{ selectedIds, onChange: setSelectedIds }}
      />
    );
  };
  render(<ControlledTable />);
  act(() => fireEvent.click(rowCheckbox("Empresa 2")));
  expect(rowCheckbox("Empresa 2")).toHaveAttribute("aria-checked", "true");
  expect(rowCheckbox("Empresa 1")).toHaveAttribute("aria-checked", "true");
});

test("the page of the header checkbox includes the rows of collapsed groups", () => {
  const onChange = vi.fn();
  const container = renderTable({
    defaultPageSize: 50,
    groupableColumnIds: ["status"],
    defaultGroupBy: "status",
    rowSelection: { onChange },
  });
  fireEvent.click(container.querySelector(".gdy-table-group-toggle") as Element);
  fireEvent.click(pageCheckbox());
  expect(onChange.mock.lastCall?.[0]).toHaveLength(6);
});
