import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ControlsMock } from "../components/mocks/controls/Controls.mock";

const CONTROL_SECTIONS = ["Control segmentado", "Selector de país", "Teléfono con prefijo"];

test("renders the three control sections, each waiting for its entry point", () => {
  render(<ControlsMock />);
  for (const name of CONTROL_SECTIONS) {
    expect(screen.getByRole("region", { name })).toBeInTheDocument();
  }
  expect(screen.getByText("gridory/segmented-control")).toBeInTheDocument();
  expect(screen.getByText("gridory/country-select")).toBeInTheDocument();
  expect(screen.getByText("gridory/phone-input")).toBeInTheDocument();
});

test("renders the scroll container at the bottom and an empty event log", () => {
  render(<ControlsMock />);
  const scrollArea = screen.getByRole("region", { name: "Área con scroll" });
  expect(screen.getByRole("region", { name: "Contenedor con scroll" })).toContainElement(scrollArea);
  expect(scrollArea).toHaveAttribute("tabindex", "0");
  expect(screen.getByRole("heading", { name: "Eventos emitidos" })).toBeInTheDocument();
  expect(screen.getByText("Aún no hay eventos.")).toBeInTheDocument();
});
