import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { KanbanBoard, type KanbanBoardProps, type KanbanGroupOption } from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
  values: ["Activa", "Pendiente", "Archivada"].map((value) => ({ value, label: value })),
};

const renderBoard = (props: Partial<KanbanBoardProps<BaselineRow>> = {}) =>
  render(
    <KanbanBoard
      fields={BASELINE_COLUMNS}
      groups={[STATUS_GROUP]}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={BASELINE_ROWS}
      {...props}
    />,
  );

const root = () => document.querySelector(".gdy-kanban") as HTMLElement;
const bodies = () => [...document.querySelectorAll<HTMLElement>(".gdy-kanban-column-body")];
const column = (value: string) => document.querySelector(`[data-column-value="${value}"]`) as HTMLElement;

test("with every size prop on, the board fills its parent, sizes its columns and still moves cards", async () => {
  const onCardMove = vi.fn();
  renderBoard({ fillHeight: true, columnWidth: 280, fillWidth: true, moveMenu: "always", onCardMove });
  expect(root()).toHaveClass("gdy-kanban", "gdy-kanban-fill", "gdy-kanban-fill-width");
  expect(root().style.getPropertyValue("--gdy-kanban-column-width")).toBe("280px");
  bodies().forEach((body) => expect(body.style.maxHeight).toBe(""));
  const card = screen.getByText("Frío Delta").closest(".gdy-kanban-card") as HTMLElement;
  fireEvent.keyDown(within(card).getByRole("button", { name: "Opciones" }), { key: "Enter" });
  fireEvent.keyDown(screen.getByRole("menuitem", { name: "Mover a…" }), { key: "ArrowRight" });
  fireEvent.click(within(screen.getAllByRole("menu")[1]).getByRole("menuitem", { name: "Pendiente" }));
  await waitFor(() => expect(column("Pendiente")).toHaveTextContent("Frío Delta"));
  expect(onCardMove).toHaveBeenCalledTimes(1);
});

test("fillHeight drops the inline cap even when columnBodyMaxHeight is passed", () => {
  renderBoard({ fillHeight: true, columnBodyMaxHeight: 300 });
  bodies().forEach((body) => expect(body).not.toHaveAttribute("style"));
});

test("each size prop works on its own and touches nothing else", () => {
  const view = renderBoard({ columnWidth: 360 });
  expect(root().className).toBe("gdy-kanban gdy-thin-scroll");
  expect(root().getAttribute("style")).toBe("--gdy-kanban-column-width: 360px;");
  bodies().forEach((body) => expect(body.style.maxHeight).toBe("480px"));
  view.unmount();
  renderBoard({ fillWidth: true, className: "app-board" });
  expect(root().className).toBe("gdy-kanban gdy-thin-scroll gdy-kanban-fill-width app-board");
  expect(root()).not.toHaveAttribute("style");
});

test("the loading columns follow the size props too", () => {
  renderBoard({ fillHeight: true, columnWidth: 300, loading: true });
  expect(root()).toHaveClass("gdy-kanban-fill");
  expect(root().style.getPropertyValue("--gdy-kanban-column-width")).toBe("300px");
  expect(document.querySelectorAll(".gdy-kanban-column").length).toBeGreaterThan(0);
});
