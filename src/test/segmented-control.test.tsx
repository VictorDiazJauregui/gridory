import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { resolveNextIndex } from "../components/segmented-control/model/next-index";
import { SegmentedControl } from "../components/segmented-control";
import type { SegmentedControlProps } from "../components/segmented-control";
import { CALENDAR_VIEW_OPTIONS, COMPANY_VIEW_OPTIONS } from "../components/mocks/controls/segmented/segmented-options";
import type { AccessibleName } from "../components/shared/accessible-name";

type SegmentedOverrides = Partial<Omit<SegmentedControlProps, keyof AccessibleName>>;

const CALENDAR_NAME: AccessibleName = { "aria-label": "Vista del calendario" };

const renderSegmented = (overrides: SegmentedOverrides = {}, accessibleName: AccessibleName = CALENDAR_NAME) => {
  const onValueChange = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <SegmentedControl
      {...accessibleName}
      options={CALENDAR_VIEW_OPTIONS}
      defaultValue="month"
      onValueChange={onValueChange}
      {...overrides}
    />,
  );
  return { ...view, onValueChange, user };
};

const renderBetweenButtons = (overrides: SegmentedOverrides) => {
  const user = userEvent.setup();
  render(
    <>
      <button type="button">Antes</button>
      <SegmentedControl {...CALENDAR_NAME} options={CALENDAR_VIEW_OPTIONS} {...overrides} />
      <button type="button">Después</button>
    </>,
  );
  return user;
};

// jsdom has no layout: every option measures 0 wide, like a hidden control.
// These offsets stand in for a laid-out row of options.
const OFFSET_LEFT_BY_LABEL: Record<string, number> = { Mes: 5, Semana: 57, Día: 121, Designados: 165 };

const mockOptionLayout = () => {
  vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function (this: HTMLElement) {
    return OFFSET_LEFT_BY_LABEL[this.textContent ?? ""] ?? 0;
  });
  vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockReturnValue(5);
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(48);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(28);
};

afterEach(() => {
  vi.restoreAllMocks();
});

const readIndicatorVariable = (axis: string) =>
  screen.getByRole("radiogroup").style.getPropertyValue(`--gdy-segmented-indicator-${axis}`);

const findIndicator = () => screen.getByRole("radiogroup").querySelector(".gdy-segmented-indicator");

const getRadio = (name: string) => screen.getByRole("radio", { name });

const listCheckedRadioNames = () =>
  screen.getAllByRole("radio", { checked: true }).map((element) => element.textContent);

const listPartClasses = (name: string) =>
  Array.from(getRadio(name).children).map((element) => element.className);

test("a click checks the option and emits its value", async () => {
  const { onValueChange, user } = renderSegmented();
  await user.click(getRadio("Semana"));
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith("week");
  expect(getRadio("Semana")).toHaveAttribute("aria-checked", "true");
  expect(getRadio("Mes")).toHaveAttribute("aria-checked", "false");
});

test("picking the option that is already chosen emits nothing", async () => {
  const { onValueChange, user } = renderSegmented();
  await user.click(getRadio("Mes"));
  await user.keyboard("{Home}");
  expect(onValueChange).not.toHaveBeenCalled();
});

test("uncontrolled, it starts on defaultValue and checks the new option by itself", async () => {
  const { user } = renderSegmented({ defaultValue: "day" });
  expect(listCheckedRadioNames()).toEqual(["Día"]);
  await user.click(getRadio("Designados"));
  expect(listCheckedRadioNames()).toEqual(["Designados"]);
});

test("controlled, it emits but keeps the value it was given until the parent updates it", async () => {
  const { onValueChange, user } = renderSegmented({ value: "month", defaultValue: undefined });
  await user.click(getRadio("Semana"));
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith("week");
  expect(listCheckedRadioNames()).toEqual(["Mes"]);
});

test("controlled, it follows the value the parent sets in onValueChange", async () => {
  const ControlledCalendar = () => {
    const [view, setView] = useState("month");
    return <SegmentedControl {...CALENDAR_NAME} options={CALENDAR_VIEW_OPTIONS} value={view} onValueChange={setView} />;
  };
  const user = userEvent.setup();
  render(<ControlledCalendar />);
  await user.click(getRadio("Día"));
  expect(listCheckedRadioNames()).toEqual(["Día"]);
});

test.each([
  ["{ArrowRight}", "Semana", "week"],
  ["{ArrowDown}", "Semana", "week"],
  ["{ArrowLeft}", "Designados", "assigned"],
  ["{ArrowUp}", "Designados", "assigned"],
  ["{End}", "Designados", "assigned"],
])("%s from the first option focuses and chooses %s", async (keys, name, value) => {
  const { onValueChange, user } = renderSegmented();
  await user.tab();
  await user.keyboard(keys);
  expect(getRadio(name)).toHaveFocus();
  expect(getRadio(name)).toHaveAttribute("aria-checked", "true");
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith(value);
});

test.each([
  ["{ArrowRight}", "Mes", "month"],
  ["{ArrowDown}", "Mes", "month"],
  ["{Home}", "Mes", "month"],
])("%s from the last option focuses and chooses %s", async (keys, name, value) => {
  const { onValueChange, user } = renderSegmented({ defaultValue: "assigned" });
  await user.tab();
  await user.keyboard(keys);
  expect(getRadio(name)).toHaveFocus();
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith(value);
});

test("controlled without an update, the arrows still move from the focused option", async () => {
  const { onValueChange, user } = renderSegmented({ value: "month", defaultValue: undefined });
  await user.tab();
  await user.keyboard("{ArrowRight}{ArrowRight}");
  expect(getRadio("Día")).toHaveFocus();
  expect(onValueChange.mock.calls).toEqual([["week"], ["day"]]);
  expect(listCheckedRadioNames()).toEqual(["Mes"]);
});

test("the handled keys do not scroll the page; the others keep their default", () => {
  renderSegmented();
  expect(fireEvent.keyDown(getRadio("Mes"), { key: "ArrowDown" })).toBe(false);
  expect(fireEvent.keyDown(getRadio("Semana"), { key: "End" })).toBe(false);
  expect(fireEvent.keyDown(getRadio("Designados"), { key: "a" })).toBe(true);
});

test("a modified arrow is left to the browser", () => {
  const { onValueChange } = renderSegmented();
  expect(fireEvent.keyDown(getRadio("Mes"), { key: "ArrowRight", altKey: true })).toBe(true);
  expect(onValueChange).not.toHaveBeenCalled();
});

test("the group is a single tab stop, on the chosen option", async () => {
  const user = renderBetweenButtons({ defaultValue: "day" });
  expect(screen.getAllByRole("radio").map((element) => element.tabIndex)).toEqual([-1, -1, 0, -1]);
  await user.tab();
  await user.tab();
  expect(getRadio("Día")).toHaveFocus();
  await user.tab();
  expect(screen.getByRole("button", { name: "Después" })).toHaveFocus();
});

test("with a value that matches no option, nothing is checked and the first option is the tab stop", async () => {
  const user = renderBetweenButtons({ value: "year" });
  expect(screen.queryAllByRole("radio", { checked: true })).toHaveLength(0);
  await user.tab();
  await user.tab();
  expect(getRadio("Mes")).toHaveFocus();
  expect(getRadio("Mes")).toHaveAttribute("tabindex", "0");
});

test("the radiogroup is named by aria-label", () => {
  renderSegmented();
  expect(screen.getByRole("radiogroup", { name: "Vista del calendario" })).toBeInTheDocument();
});

test("the radiogroup is named by aria-labelledby", () => {
  render(
    <>
      <h2 id="calendar-view-title">Vista</h2>
      <SegmentedControl aria-labelledby="calendar-view-title" options={CALENDAR_VIEW_OPTIONS} />
    </>,
  );
  expect(screen.getByRole("radiogroup", { name: "Vista" })).toBeInTheDocument();
});

test("every option is a getRadio with aria-checked", () => {
  renderSegmented({ defaultValue: "week" });
  const checkedStates = screen.getAllByRole("radio").map((element) => element.getAttribute("aria-checked"));
  expect(checkedStates).toEqual(["false", "true", "false", "false"]);
  expect(getRadio("Semana")).toHaveAttribute("type", "button");
});

test("the icon goes before the label by default, hidden from screen readers", () => {
  renderSegmented({ options: COMPANY_VIEW_OPTIONS, defaultValue: "team" });
  expect(listPartClasses("Equipo")).toEqual(["gdy-segmented-icon", "gdy-segmented-label"]);
  expect(getRadio("Equipo").querySelector(".gdy-segmented-icon")).toHaveAttribute("aria-hidden", "true");
});

test('iconPosition="end" puts the icon after the label', () => {
  renderSegmented({ options: COMPANY_VIEW_OPTIONS, iconPosition: "end" });
  expect(listPartClasses("Mis empresas")).toEqual(["gdy-segmented-label", "gdy-segmented-icon"]);
});

test("an option without an icon renders only its label", () => {
  renderSegmented();
  expect(listPartClasses("Mes")).toEqual(["gdy-segmented-label"]);
});

test("className and classNames add to the gdy-segmented hooks", () => {
  renderSegmented({
    options: COMPANY_VIEW_OPTIONS,
    defaultValue: "team",
    className: "app-switch",
    classNames: { root: "app-root", item: "app-item", icon: "app-icon", label: "app-label" },
  });
  expect(screen.getByRole("radiogroup")).toHaveClass("gdy-segmented", "app-switch", "app-root");
  expect(getRadio("Equipo")).toHaveClass("gdy-segmented-item", "app-item");
  expect(listPartClasses("Equipo")).toEqual(["gdy-segmented-icon app-icon", "gdy-segmented-label app-label"]);
});

test("the indicator mounts on the measured box of the chosen option and follows the choice", async () => {
  mockOptionLayout();
  const { user } = renderSegmented({ classNames: { indicator: "app-indicator" } });
  expect(findIndicator()).toHaveAttribute("aria-hidden", "true");
  expect(findIndicator()).toHaveClass("gdy-segmented-indicator", "app-indicator");
  expect(["x", "y", "width", "height"].map(readIndicatorVariable)).toEqual(["5px", "5px", "48px", "28px"]);
  await user.click(getRadio("Día"));
  expect(readIndicatorVariable("x")).toBe("121px");
});

test("with a value that matches no option there is no indicator", () => {
  mockOptionLayout();
  renderSegmented({ value: "year", defaultValue: undefined });
  expect(findIndicator()).toBeNull();
  expect(readIndicatorVariable("x")).toBe("");
});

test("a control that measures 0 wide, as a hidden one does, mounts no indicator", () => {
  renderSegmented();
  expect(findIndicator()).toBeNull();
});

test('animated is on by default: the root carries data-animated="true"', () => {
  renderSegmented();
  expect(screen.getByRole("radiogroup")).toHaveAttribute("data-animated", "true");
});

test('animated={false} exposes data-animated="false"', () => {
  renderSegmented({ animated: false });
  expect(screen.getByRole("radiogroup")).toHaveAttribute("data-animated", "false");
});

test.each([
  ["ArrowRight", 0, 1],
  ["ArrowDown", 2, 3],
  ["ArrowRight", 3, 0],
  ["ArrowLeft", 2, 1],
  ["ArrowUp", 1, 0],
  ["ArrowLeft", 0, 3],
  ["Home", 2, 0],
  ["End", 1, 3],
])("%s from %i of four options goes to %i", (key, currentIndex, expectedIndex) => {
  expect(resolveNextIndex(key, currentIndex, 4)).toBe(expectedIndex);
});

test.each(["Enter", " ", "Tab", "toString"])("%j does not move", (key) => {
  expect(resolveNextIndex(key, 1, 4)).toBeNull();
});

test("without options nothing moves", () => {
  expect(resolveNextIndex("End", 0, 0)).toBeNull();
});
