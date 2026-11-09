import { render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { CardGrid } from "../components/card-grid";
import { DataTable, type ColumnDefinition } from "../components/table";
import { dragPointer } from "./browser/pointer-drag";
import { clearTextSelection } from "./text-selection";

interface NoteRow {
  id: string;
  note: string;
}

const ROWS: NoteRow[] = [
  { id: "n1", note: "Contrato con el área comercial" },
  { id: "n2", note: "Llamar al responsable" },
];

const renderNote = (row: NoteRow) => (
  <p>
    <span className="note-text">{row.note}</span> <span className="note-tag">Nota</span>
  </p>
);

const COLUMNS: ColumnDefinition<NoteRow>[] = [{ id: "note", header: "Nota", accessor: (row) => row.note, cell: renderNote }];

const DRAG = { deltaX: 60, steps: 12 };

afterEach(clearTextSelection);

const renderTable = (ignoreTextSelectionClick: boolean) => {
  const onRowClick = vi.fn();
  render(<DataTable columns={COLUMNS} data={ROWS} getRowId={(row) => row.id} {...{ onRowClick, ignoreTextSelectionClick }} />);
  return onRowClick;
};

const renderGrid = (ignoreTextSelectionClick: boolean) => {
  const onRowClick = vi.fn();
  render(
    <CardGrid
      columns={COLUMNS}
      data={ROWS}
      getRowId={(row) => row.id}
      renderCard={renderNote}
      {...{ onRowClick, ignoreTextSelectionClick }}
    />,
  );
  return onRowClick;
};

const selectedText = () => document.getSelection()?.toString().trim() ?? "";

const TABLE_TEXT = '.gdy-table-row[data-row-id="n1"] .note-text';
const CARD_TEXT = '.gdy-card-grid-card[data-row-id="n1"] .note-text';

test.each([
  ["row", renderTable, TABLE_TEXT],
  ["card", renderGrid, CARD_TEXT],
])("with the option, a real drag over the text of a %s selects it without firing; a click beside it fires", async (_kind, renderView, selector) => {
  const onRowClick = renderView(true);
  await dragPointer({ selector, ...DRAG });
  expect(selectedText()).not.toBe("");
  expect(onRowClick).not.toHaveBeenCalled();
  await userEvent.click(document.querySelector(selector.replace("note-text", "note-tag")) as HTMLElement);
  expect(selectedText()).toBe("");
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test.each([
  ["row", renderTable, TABLE_TEXT],
  ["card", renderGrid, CARD_TEXT],
])("without the option, a real drag over the text of a %s still fires it, as in 2.1.0", async (_kind, renderView, selector) => {
  const onRowClick = renderView(false);
  await dragPointer({ selector, ...DRAG });
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test("with the option, the first click on the selected text only clears it; the next one fires the row", async () => {
  const onRowClick = renderTable(true);
  await dragPointer({ selector: TABLE_TEXT, ...DRAG });
  await userEvent.click(document.querySelector(TABLE_TEXT) as HTMLElement);
  expect(onRowClick).not.toHaveBeenCalled();
  await userEvent.click(document.querySelector(TABLE_TEXT) as HTMLElement);
  expect(onRowClick).toHaveBeenCalledTimes(1);
});
