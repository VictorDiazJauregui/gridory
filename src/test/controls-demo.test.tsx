import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { ControlsMock } from "../components/mocks/controls/Controls.mock";

const CONTROL_SECTIONS = ["Control segmentado", "Selector de país", "Teléfono con prefijo"];
const SEGMENTED_EXAMPLES = [
  "Vista de empresa",
  "Vista del calendario",
  "Icono al final",
  "Sin animación",
  "Personalizado (solo tokens)",
];
const COUNTRY_EXAMPLES = ["Por defecto", "Obligatorio y controlado", "Angosto", "Ancho", "Múltiple"];
const PHONE_EXAMPLES = [
  "Label arriba",
  "Label al costado",
  "Obligatorio y controlado",
  "Con error",
  "Angosto",
  "Personalizado (solo tokens)",
];

const getEventLog = () => screen.getByRole("complementary");

test("renders the three control sections with their examples and no pending entry point", () => {
  render(<ControlsMock />);
  for (const name of CONTROL_SECTIONS) {
    expect(screen.getByRole("region", { name })).toBeInTheDocument();
  }
  const segmentedSection = screen.getByRole("region", { name: "Control segmentado" });
  for (const name of SEGMENTED_EXAMPLES) {
    expect(within(segmentedSection).getByRole("radiogroup", { name })).toBeInTheDocument();
  }
  expect(screen.queryByText("gridory/segmented-control")).not.toBeInTheDocument();
  expect(screen.queryByText("gridory/country-select")).not.toBeInTheDocument();
  expect(screen.queryByText("gridory/phone-input")).not.toBeInTheDocument();
});

test("renders the country examples in their section and one at the bottom of the scroll container", () => {
  render(<ControlsMock />);
  const countrySection = screen.getByRole("region", { name: "Selector de país" });
  for (const name of COUNTRY_EXAMPLES) {
    expect(within(countrySection).getByRole("heading", { name })).toBeInTheDocument();
  }
  expect(within(countrySection).getAllByRole("combobox")).toHaveLength(COUNTRY_EXAMPLES.length);
  const scrollArea = screen.getByRole("region", { name: "Área con scroll" });
  expect(within(scrollArea).getByRole("heading", { name: "En el contenedor con scroll" })).toBeInTheDocument();
  expect(within(scrollArea).getByRole("combobox", { name: "País" })).toBeInTheDocument();
  expect(screen.getByText("Valor actual: PE")).toBeInTheDocument();
});

test("renders the phone examples in their section and one at the bottom of the scroll container", () => {
  render(<ControlsMock />);
  const phoneSection = screen.getByRole("region", { name: "Teléfono con prefijo" });
  for (const name of PHONE_EXAMPLES) {
    expect(within(phoneSection).getByRole("heading", { name })).toBeInTheDocument();
  }
  expect(within(phoneSection).getAllByRole("combobox", { name: /^Prefijo/ })).toHaveLength(PHONE_EXAMPLES.length);
  const scrollArea = screen.getByRole("region", { name: "Área con scroll" });
  expect(within(scrollArea).getByRole("heading", { name: "Teléfono en el contenedor con scroll" })).toBeInTheDocument();
  expect(within(scrollArea).getByRole("combobox", { name: "Prefijo: Canadá +1" })).toBeInTheDocument();
  expect(screen.getByText("Valor actual: PE · sin número")).toBeInTheDocument();
});

test("typing a phone number records onValueChange with the country and the number", async () => {
  const user = userEvent.setup();
  render(<ControlsMock />);
  const phoneSection = screen.getByRole("region", { name: "Teléfono con prefijo" });
  await user.type(within(phoneSection).getAllByRole("textbox", { name: "Teléfono" })[0], "9");
  expect(within(getEventLog()).getByText(/"control": "Label arriba"/)).toBeInTheDocument();
  expect(within(getEventLog()).getByText(/"number": "9"/)).toBeInTheDocument();
});

test("renders the scroll container at the bottom and an empty event log", () => {
  render(<ControlsMock />);
  const scrollArea = screen.getByRole("region", { name: "Área con scroll" });
  expect(screen.getByRole("region", { name: "Contenedor con scroll" })).toContainElement(scrollArea);
  expect(scrollArea).toHaveAttribute("tabindex", "0");
  expect(screen.getByRole("heading", { name: "Eventos emitidos" })).toBeInTheDocument();
  expect(screen.getByText("Aún no hay eventos.")).toBeInTheDocument();
});

test("choosing a segmented option records onValueChange with the example and the value", async () => {
  const user = userEvent.setup();
  render(<ControlsMock />);
  const companyView = screen.getByRole("radiogroup", { name: "Vista de empresa" });
  await user.click(within(companyView).getByRole("radio", { name: "Equipo" }));
  expect(within(getEventLog()).getByText("onValueChange")).toBeInTheDocument();
  expect(within(getEventLog()).getByText(/"control": "Con iconos"/)).toBeInTheDocument();
  expect(within(getEventLog()).getByText(/"value": "team"/)).toBeInTheDocument();
});

test("the controlled example shows the value it holds", async () => {
  const user = userEvent.setup();
  render(<ControlsMock />);
  expect(screen.getByText("Valor actual: Mes")).toBeInTheDocument();
  const calendarView = screen.getByRole("radiogroup", { name: "Vista del calendario" });
  await user.click(within(calendarView).getByRole("radio", { name: "Semana" }));
  expect(screen.getByText("Valor actual: Semana")).toBeInTheDocument();
});

test("choosing a country records onValueChange with the example and the value", async () => {
  const user = userEvent.setup();
  render(<ControlsMock />);
  const countrySection = screen.getByRole("region", { name: "Selector de país" });
  const [defaultExample] = within(countrySection).getAllByRole("combobox", { name: "País" });
  await user.click(defaultExample);
  await user.click(await screen.findByRole("option", { name: "Perú" }));
  expect(within(getEventLog()).getByText(/"control": "Por defecto"/)).toBeInTheDocument();
  expect(within(getEventLog()).getByText(/"value": "PE"/)).toBeInTheDocument();
});
