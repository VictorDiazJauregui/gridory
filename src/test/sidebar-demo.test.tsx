import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { SidebarMock } from "../components/mocks/sidebar/Sidebar.mock";

const DEMO_SECTIONS = ["Estructura", "Modos", "Tooltips", "Personalizado (solo tokens)"];

test("renders the sidebar demo sections and the event log", () => {
  render(<SidebarMock />);
  expect(screen.getByRole("heading", { level: 2, name: "Menú lateral" })).toBeInTheDocument();
  for (const name of DEMO_SECTIONS) {
    expect(screen.getByRole("region", { name })).toBeInTheDocument();
  }
  expect(screen.getByRole("complementary")).toHaveTextContent("Eventos emitidos");
});
