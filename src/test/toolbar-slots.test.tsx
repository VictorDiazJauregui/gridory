import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { KanbanBoard } from "../components/kanban";
import { DuplicateToolbarSlotError } from "../components/shared/toolbar/toolbar-custom-slots";
import { DataTable, type DataTableProps, type ToolbarCustomSlot } from "../components/table";
import {
  BASELINE_COLUMNS,
  BASELINE_ROWS,
  BASELINE_TOGGLE_GROUP,
  type BaselineRow,
} from "./baseline-fixture";
import { expectRenderError } from "./expect-render-error";

type TableProps = Partial<DataTableProps<BaselineRow>>;

const COUNTER: ToolbarCustomSlot = { id: "seats", content: <span>Asientos 7/10</span> };
const NEW_CONTACT: ToolbarCustomSlot = {
  id: "newContact",
  position: "left",
  className: "app-new-contact",
  content: <button type="button">Nuevo contacto</button>,
};

const renderTable = (props: TableProps = {}) =>
  render(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} onCreate={() => {}} {...props} />);

const sideIds = (container: HTMLElement, side: "left" | "right") =>
  [...(container.querySelector(`.gdy-toolbar-${side}`)?.children ?? [])].map(
    (child) => child.getAttribute("data-slot-id") ?? child.className.split(" ")[0],
  );

test("each slot renders its content in a gdy-toolbar-slot wrapper", () => {
  const { container } = renderTable({ toolbarSlots: [COUNTER, NEW_CONTACT] });
  const counter = container.querySelector('[data-slot-id="seats"]');
  expect(counter).toHaveClass("gdy-toolbar-slot");
  expect(counter).toHaveTextContent("Asientos 7/10");
  expect(container.querySelector('[data-slot-id="newContact"]')).toHaveAttribute(
    "class",
    "gdy-toolbar-slot app-new-contact",
  );
});

test("without toolbarLayout a slot goes at the end of its side, right by default", () => {
  const { container } = renderTable({ toolbarSlots: [COUNTER, NEW_CONTACT] });
  expect(sideIds(container, "left").at(-1)).toBe("newContact");
  expect(sideIds(container, "right").at(-1)).toBe("seats");
  expect(sideIds(container, "right").at(-2)).toBe("gdy-btn");
});

test("toolbarLayout places the slots like any built-in id and skips the unlisted ones", () => {
  const { container } = renderTable({
    toolbarSlots: [COUNTER, NEW_CONTACT],
    toolbarLayout: { left: ["search"], right: ["seats", "create"] },
  });
  expect(sideIds(container, "left")).toEqual(["gdy-search"]);
  expect(sideIds(container, "right")[0]).toBe("seats");
  expect(container.querySelector('[data-slot-id="newContact"]')).toBeNull();
});

test("the content of a slot keeps working", () => {
  const onClick = vi.fn();
  renderTable({
    toolbarSlots: [{ id: "export", content: <button type="button" onClick={onClick}>Exportar</button> }],
  });
  fireEvent.click(screen.getByRole("button", { name: "Exportar" }));
  expect(onClick).toHaveBeenCalledTimes(1);
});

test.each([
  ["a built-in slot", [{ id: "search", content: null }], {}],
  ["another slot", [COUNTER, { id: "seats", content: null }], {}],
  ["a toggle group", [{ id: BASELINE_TOGGLE_GROUP.id, content: null }], { toggleGroups: [BASELINE_TOGGLE_GROUP] }],
])("an id taken by %s throws DuplicateToolbarSlotError", (_, toolbarSlots, extra) => {
  expectRenderError(
    <DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} toolbarSlots={toolbarSlots} {...extra} />,
    DuplicateToolbarSlotError,
  );
});

test("the error names the repeated id", () => {
  expect(new DuplicateToolbarSlotError("seats").message).toContain('"seats"');
});

test("the kanban toolbar renders the same slots", () => {
  const { container } = render(
    <KanbanBoard
      fields={BASELINE_COLUMNS}
      groups={[{ id: "status", label: "Estado", accessor: (row) => row.status, setValue: (row) => row }]}
      defaultGroupId="status"
      getCardId={(row) => row.id}
      data={BASELINE_ROWS}
      toolbarSlots={[COUNTER]}
    />,
  );
  expect(sideIds(container, "right").at(-1)).toBe("seats");
});
