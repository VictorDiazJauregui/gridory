import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { CardGridMock } from "../components/mocks/card-grid/CardGrid.mock";

const searchBox = () => screen.getByRole("searchbox") as HTMLInputElement;

test("the view selector switches between cards, table and kanban keeping the search", async () => {
  const user = userEvent.setup();
  const { container } = render(<CardGridMock />);
  expect(container.querySelector(".gdy-card-grid")).not.toBeNull();
  fireEvent.change(searchBox(), { target: { value: "Frio Delta" } });
  expect(container.querySelectorAll(".gdy-card-grid-card")).toHaveLength(1);
  await user.click(screen.getByRole("radio", { name: "Tabla" }));
  expect(container.querySelector(".gdy-table")).not.toBeNull();
  expect(searchBox().value).toBe("Frio Delta");
  expect(container.querySelectorAll("tbody tr.gdy-table-row")).toHaveLength(1);
  await user.click(screen.getByRole("radio", { name: "Kanban" }));
  expect(searchBox().value).toBe("Frio Delta");
  expect(container.querySelectorAll(".gdy-kanban-card")).toHaveLength(1);
});
