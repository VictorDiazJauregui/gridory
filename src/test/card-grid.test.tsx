import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { CardGrid, type CardGridProps } from "../components/card-grid";
import { navigateTo, openInNewTab } from "../components/table/body/browser-navigation";
import { BASELINE_COLUMNS, BASELINE_ROW_ACTIONS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

vi.mock("../components/table/body/browser-navigation", () => ({ openInNewTab: vi.fn(), navigateTo: vi.fn() }));

beforeEach(() => vi.clearAllMocks());

type GridProps = Partial<CardGridProps<BaselineRow>>;

const COLUMNS = BASELINE_COLUMNS.map((column) => ({ ...column, filterable: true }));

const MANY_ROWS: BaselineRow[] = Array.from({ length: 30 }, (_, index) => ({
  ...BASELINE_ROWS[index % BASELINE_ROWS.length],
  id: `m${index}`,
  name: `Empresa ${String(index + 1).padStart(2, "0")}`,
}));

const gridElement = (props: GridProps = {}) => (
  <CardGrid columns={COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />
);

const renderGrid = (props: GridProps = {}) => render(gridElement(props));

const cards = () => within(screen.getByRole("list")).getAllByRole("listitem");

const cardTitles = () => cards().map((card) => card.querySelector(".gdy-kanban-card-title")?.textContent);

const cardOf = (name: string) => screen.getByText(name).closest("li") as HTMLElement;

const openFilter = (container: HTMLElement, header: string) => {
  fireEvent.click(screen.getByRole("button", { name: header }));
  return container.querySelector(".gdy-panel") as HTMLElement;
};

test("renders a list with one card per row: title, subtitle and the next fields", () => {
  renderGrid();
  expect(cardTitles()).toEqual(["Frío Delta", "Pack Norte", "Cold South"]);
  const card = cardOf("Frío Delta");
  expect(card).toHaveClass("gdy-card-grid-card", "gdy-kanban-card");
  expect(card).toHaveAttribute("data-row-id", "b1");
  expect(card.querySelector(".gdy-kanban-card-subtitle")).toHaveTextContent("Perú");
  expect(card.querySelector(".gdy-kanban-card-value")).toHaveTextContent("Estado: Activa");
  expect(card.querySelector(".gdy-kanban-tag")).toBeNull();
});

test("searches, filters and sorts like the table", () => {
  const { container } = renderGrid();
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "cold" } });
  expect(cardTitles()).toEqual(["Cold South"]);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
  fireEvent.click(within(openFilter(container, "Estado")).getByText("Activa"));
  expect(cardTitles()).toEqual(["Frío Delta", "Cold South"]);
  fireEvent.click(within(openFilter(container, "Empresa")).getByText("Descendente (Z → A)"));
  expect(cardTitles()).toEqual(["Frío Delta", "Cold South"]);
  fireEvent.click(within(container.querySelector(".gdy-panel") as HTMLElement).getByText("Ascendente (A → Z)"));
  expect(cardTitles()).toEqual(["Cold South", "Frío Delta"]);
});

test("pages the cards and goes back to the first page after a search", () => {
  const onPaginationChange = vi.fn();
  renderGrid({ data: MANY_ROWS, defaultPageSize: 25, onPaginationChange });
  expect(cards()).toHaveLength(25);
  expect(screen.getByText("Mostrando 1–25 de 30 elementos")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Página siguiente" }));
  expect(onPaginationChange).toHaveBeenCalledExactlyOnceWith({ pageIndex: 1, pageSize: 25 });
  expect(cardTitles()).toEqual(["Empresa 26", "Empresa 27", "Empresa 28", "Empresa 29", "Empresa 30"]);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Empresa 0" } });
  expect(cardTitles()).toHaveLength(9);
  expect(screen.getByText("Página 1 de 1")).toBeInTheDocument();
});

test("a controlled page shows that page", () => {
  renderGrid({ data: MANY_ROWS, pageIndex: 1, pageSize: 25 });
  expect(cards()).toHaveLength(5);
});

test("a click calls onRowClick with the row; Enter on the focused card does the same", () => {
  const onRowClick = vi.fn();
  renderGrid({ onRowClick });
  const card = cardOf("Pack Norte");
  expect(card).toHaveAttribute("tabindex", "0");
  expect(card).toHaveAttribute("data-clickable");
  fireEvent.click(card);
  expect(onRowClick).toHaveBeenLastCalledWith(BASELINE_ROWS[1], expect.objectContaining({ type: "click" }));
  card.focus();
  fireEvent.keyDown(card, { key: "Enter" });
  expect(onRowClick).toHaveBeenCalledTimes(2);
  expect(onRowClick).toHaveBeenLastCalledWith(BASELINE_ROWS[1], expect.objectContaining({ key: "Enter" }));
});

test("a card without onRowClick nor getRowHref is not focusable", () => {
  renderGrid();
  expect(cardOf("Pack Norte")).not.toHaveAttribute("tabindex");
  expect(cardOf("Pack Norte")).not.toHaveAttribute("data-clickable");
});

test("getRowHref turns a card into a link: click navigates, Ctrl/Cmd + click and middle click open a tab", () => {
  renderGrid({ getRowHref: (row) => `/empresas/${row.id}` });
  const card = cardOf("Frío Delta");
  expect(card).toHaveAttribute("data-href", "/empresas/b1");
  fireEvent.click(card);
  expect(navigateTo).toHaveBeenCalledExactlyOnceWith("/empresas/b1");
  fireEvent.click(card, { ctrlKey: true });
  fireEvent.click(card, { metaKey: true });
  fireEvent(card, new MouseEvent("auxclick", { bubbles: true, button: 1 }));
  expect(openInNewTab).toHaveBeenCalledTimes(3);
  expect(navigateTo).toHaveBeenCalledTimes(1);
});

test("with onRowClick and getRowHref, a click calls onRowClick and Ctrl + click opens the link", () => {
  const onRowClick = vi.fn();
  renderGrid({ onRowClick, getRowHref: (row) => `/empresas/${row.id}` });
  fireEvent.click(cardOf("Cold South"));
  expect(onRowClick).toHaveBeenCalledOnce();
  fireEvent.click(cardOf("Cold South"), { ctrlKey: true });
  expect(openInNewTab).toHaveBeenCalledExactlyOnceWith("/empresas/b3");
  expect(onRowClick).toHaveBeenCalledOnce();
});

test("an unsafe href is ignored", () => {
  renderGrid({ getRowHref: () => "javascript:alert(1)" });
  expect(cardOf("Frío Delta")).not.toHaveAttribute("data-href");
  expect(cardOf("Frío Delta")).not.toHaveAttribute("tabindex");
});

test("the ⋯ menu offers the row actions and opening it does not click the card", async () => {
  const onRowClick = vi.fn();
  const onEdit = vi.fn();
  renderGrid({ onRowClick, rowActions: { ...BASELINE_ROW_ACTIONS, onEdit } });
  const trigger = within(cardOf("Frío Delta")).getByRole("button", { name: "Opciones" });
  fireEvent.click(trigger);
  fireEvent.keyDown(trigger, { key: "Enter" });
  fireEvent.click(await screen.findByRole("menuitem", { name: "Editar" }));
  expect(onEdit).toHaveBeenCalledExactlyOnceWith(BASELINE_ROWS[0]);
  expect(onRowClick).not.toHaveBeenCalled();
});

test("features.rowActions false leaves the cards without menu", () => {
  renderGrid({ rowActions: BASELINE_ROW_ACTIONS, features: { rowActions: false } });
  expect(within(cardOf("Frío Delta")).queryByRole("button", { name: "Opciones" })).toBeNull();
});

test("shows emptyMessage when no card matches", () => {
  renderGrid({ emptyMessage: "Nada por aquí", classNames: { empty: "my-empty" } });
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "zzz" } });
  expect(screen.getByText("Nada por aquí")).toHaveClass("gdy-empty", "my-empty");
  expect(screen.queryByRole("list")).toBeNull();
});

test("while loading it shows placeholder cards and marks the root busy", () => {
  const { container } = renderGrid({ loading: true, loadingRowCount: 4 });
  const root = container.querySelector(".gdy-card-grid") as HTMLElement;
  expect(root).toHaveAttribute("aria-busy", "true");
  expect(root).toHaveAttribute("data-loading");
  expect(container.querySelectorAll(".gdy-card-grid-skeleton")).toHaveLength(4);
  expect(container.querySelector(".gdy-card-grid-card")).toBeNull();
});

test("renderLoading replaces the placeholder cards", () => {
  const { container } = renderGrid({ loading: true, renderLoading: () => <p>Cargando empresas</p> });
  expect(screen.getByText("Cargando empresas").parentElement).toHaveClass("gdy-card-grid-loading");
  expect(container.querySelector(".gdy-card-grid-skeleton")).toBeNull();
});

test("onVisibleRowsChange reports on mount and after a search, never while loading", () => {
  const onVisibleRowsChange = vi.fn();
  const { rerender } = render(gridElement({ loading: true, onVisibleRowsChange }));
  expect(onVisibleRowsChange).not.toHaveBeenCalled();
  rerender(gridElement({ onVisibleRowsChange }));
  expect(onVisibleRowsChange).toHaveBeenCalledExactlyOnceWith({
    pageRows: BASELINE_ROWS,
    filteredRows: BASELINE_ROWS,
    totalRows: 3,
  });
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Pack" } });
  expect(onVisibleRowsChange).toHaveBeenLastCalledWith({
    pageRows: [BASELINE_ROWS[1]],
    filteredRows: [BASELINE_ROWS[1]],
    totalRows: 1,
  });
  rerender(gridElement({ onVisibleRowsChange }));
  expect(onVisibleRowsChange).toHaveBeenCalledTimes(2);
});

test("renderCard replaces the content and keeps the ⋯ menu", () => {
  renderGrid({ renderCard: (row) => <strong>{`${row.name} · ${row.country}`}</strong>, rowActions: BASELINE_ROW_ACTIONS });
  const card = cardOf("Frío Delta · Perú");
  expect(card.querySelector(".gdy-kanban-card-head")).toBeNull();
  expect(card.querySelector(".gdy-kanban-card-actions")).not.toBeNull();
  expect(within(card).getByRole("button", { name: "Opciones" })).toBeInTheDocument();
});

test("className and classNames add one class per part after its hook", () => {
  const { container } = renderGrid({
    className: "my-grid",
    classNames: { root: "my-root", toolbar: "my-toolbar", filterRow: "my-filters", list: "my-list", card: "my-card", pagination: "my-pages" },
  });
  expect(container.firstElementChild).toHaveClass("gdy-card-grid", "my-grid", "my-root");
  expect(container.querySelector(".gdy-toolbar")).toHaveClass("my-toolbar");
  expect(container.querySelector(".gdy-kanban-filter-row")).toHaveClass("my-filters");
  expect(screen.getByRole("list")).toHaveClass("gdy-card-grid-list", "my-list");
  cards().forEach((card) => expect(card).toHaveClass("gdy-card-grid-card", "my-card"));
  expect(container.querySelector(".gdy-table-pagination")).toHaveClass("my-pages");
});

test("labels replace the texts; the defaults are in Spanish", () => {
  renderGrid({ data: MANY_ROWS, labels: { itemsName: "empresas", cardFieldLabel: (header) => `${header} →` } });
  expect(screen.getByText("Mostrando 1–25 de 30 empresas")).toBeInTheDocument();
  expect(cardOf("Empresa 01").querySelector(".gdy-kanban-card-value")).toHaveTextContent("Estado → Activa");
  expect(screen.getByRole("searchbox")).toHaveAttribute("placeholder", "Buscar...");
});

test("search, filters and sort can come from outside", () => {
  const onFiltersChange = vi.fn();
  const { container, rerender } = render(gridElement({ search: "o", columnFilters: { values: { status: ["Activa"] }, dates: {} }, onFiltersChange }));
  expect(cardTitles()).toEqual(["Frío Delta", "Cold South"]);
  rerender(gridElement({ search: "", sorting: { id: "name", direction: "asc" }, columnFilters: { values: {}, dates: {} }, onFiltersChange }));
  expect(cardTitles()).toEqual(["Cold South", "Frío Delta", "Pack Norte"]);
  fireEvent.click(within(openFilter(container, "Estado")).getByText("Archivada"));
  expect(onFiltersChange).toHaveBeenCalledExactlyOnceWith({ values: { status: ["Archivada"] }, dates: {} });
  expect(cardTitles()).toHaveLength(3);
});
