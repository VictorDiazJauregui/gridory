import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { KanbanBoard, type KanbanGroupOption } from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
};

const COUNTRY_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "country",
  label: "País",
  accessor: (row) => row.country,
  setValue: (row, country) => ({ ...row, country }),
};

const STATUS_COLUMNS = ["Activa", "Archivada"];
const COUNTRY_COLUMNS = ["Chile", "México", "Perú"];

const boardElement = (groups: KanbanGroupOption<BaselineRow>[], onGroupChange = vi.fn()) => (
  <KanbanBoard
    fields={BASELINE_COLUMNS}
    groups={groups}
    defaultGroupId="status"
    getCardId={(card) => card.id}
    data={BASELINE_ROWS}
    onGroupChange={onGroupChange}
  />
);

const shownColumnValues = () =>
  [...document.querySelectorAll("[data-column-value]")].map((column) => column.getAttribute("data-column-value")).sort();

const groupSelector = () => screen.getByRole("combobox", { name: "Agrupar por" });

const chooseGroup = (label: string) => userEvent.selectOptions(groupSelector(), `Agrupar por: ${label}`);

test("choosing a group regroups the board and reports it", async () => {
  const onGroupChange = vi.fn();
  render(boardElement([STATUS_GROUP, COUNTRY_GROUP], onGroupChange));
  await chooseGroup("País");
  expect(shownColumnValues()).toEqual(COUNTRY_COLUMNS);
  expect(groupSelector()).toHaveDisplayValue("Agrupar por: País");
  expect(onGroupChange.mock.calls).toEqual([["country"]]);
});

test("when the chosen group leaves groups, the board falls back to the first one without reporting it", async () => {
  const onGroupChange = vi.fn();
  const { rerender } = render(boardElement([STATUS_GROUP, COUNTRY_GROUP], onGroupChange));
  await chooseGroup("País");
  rerender(boardElement([STATUS_GROUP], onGroupChange));
  expect(shownColumnValues()).toEqual(STATUS_COLUMNS);
  expect(groupSelector()).toHaveDisplayValue("Agrupar por: Estado");
  expect(onGroupChange.mock.calls).toEqual([["country"]]);
});

test("a group that comes back does not take the selection back", async () => {
  const { rerender } = render(boardElement([STATUS_GROUP, COUNTRY_GROUP]));
  await chooseGroup("País");
  rerender(boardElement([STATUS_GROUP]));
  rerender(boardElement([STATUS_GROUP, COUNTRY_GROUP]));
  expect(shownColumnValues()).toEqual(STATUS_COLUMNS);
  expect(groupSelector()).toHaveDisplayValue("Agrupar por: Estado");
});

test("reordering groups keeps the chosen group", async () => {
  const { rerender } = render(boardElement([STATUS_GROUP, COUNTRY_GROUP]));
  await chooseGroup("País");
  rerender(boardElement([COUNTRY_GROUP, STATUS_GROUP]));
  expect(shownColumnValues()).toEqual(COUNTRY_COLUMNS);
  expect(groupSelector()).toHaveDisplayValue("Agrupar por: País");
});
