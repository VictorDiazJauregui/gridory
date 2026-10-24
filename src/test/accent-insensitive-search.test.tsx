import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { KanbanBoard } from "../components/kanban";
import { buildCompanyColumns } from "../components/mocks/company/company-columns";
import {
  MOCK_COMPANY_ROWS,
  type MockCompanyRow,
} from "../components/mocks/company/company-rows";
import { KANBAN_STATIC_PROPS } from "../components/mocks/kanban/kanban-config";
import { DataTable, type DataTableProps } from "../components/table";

const ACCENTED_ROW: MockCompanyRow = { ...MOCK_COMPANY_ROWS[0], id: "accented", name: "Niño Andino" };
const ROWS = [...MOCK_COMPANY_ROWS, ACCENTED_ROW];
const COLUMNS = buildCompanyColumns({ appsWidth: 120, statusSearchable: true });
const PERU_COUNT = ROWS.filter((row) => row.country === "Perú").length;

const SEARCH_CASES = [
  { query: "peru", expected: PERU_COUNT },
  { query: "PERÚ", expected: PERU_COUNT },
  { query: "nino", expected: 1 },
];

const renderTable = (props: Partial<DataTableProps<MockCompanyRow>> = {}) =>
  render(
    <DataTable
      columns={COLUMNS}
      data={ROWS}
      getRowId={(row) => row.id}
      features={{ pagination: false }}
      {...props}
    />,
  );

const renderBoard = () =>
  render(
    <KanbanBoard
      fields={KANBAN_STATIC_PROPS.fields}
      groups={KANBAN_STATIC_PROPS.groups}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={ROWS}
    />,
  );

const searchFor = async (query: string) => {
  await userEvent.setup().type(screen.getByRole("searchbox"), query);
};

describe("the global search ignores accents and case", () => {
  test.each(SEARCH_CASES)("in the table: $query", async ({ query, expected }) => {
    const { container } = renderTable();
    await searchFor(query);
    expect(container.querySelectorAll(".gdy-table-row")).toHaveLength(expected);
  });

  test.each(SEARCH_CASES)("in the kanban: $query", async ({ query, expected }) => {
    const { container } = renderBoard();
    await searchFor(query);
    expect(container.querySelectorAll(".gdy-kanban-card")).toHaveLength(expected);
  });

  test("emits the query exactly as the user typed it", async () => {
    const onSearchChange = vi.fn();
    renderTable({ onSearchChange });
    await searchFor("PERÚ");
    expect(onSearchChange).toHaveBeenLastCalledWith("PERÚ");
  });
});

test("the filter menu search finds an accented option without the accent", async () => {
  const { container } = renderTable();
  fireEvent.click(screen.getByRole("button", { name: "País" }));
  const panel = container.querySelector(".gdy-panel") as HTMLElement;
  await userEvent.setup().type(within(panel).getByRole("textbox"), "peru");
  expect(within(panel).getByText("Perú")).toBeInTheDocument();
  expect(within(panel).queryByText("Chile")).not.toBeInTheDocument();
});
