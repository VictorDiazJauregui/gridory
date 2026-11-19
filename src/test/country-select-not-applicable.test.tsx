import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, expect, expectTypeOf, test, vi } from "vitest";
import {
  COUNTRY_NOT_APPLICABLE,
  CountrySelect,
  InvalidNotApplicableValueError,
  type CountryCode,
  type CountryNotApplicable,
  type CountrySelectProps,
  type NotApplicableCountrySelectProps,
} from "../components/country-select";
import { expectRenderError } from "./expect-render-error";
import { getOptionByName } from "./option-queries";

const DATA_FLAG_URL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

const countryCombobox = () => screen.getByRole("combobox", { name: "País" });

const searchBox = () => screen.getByRole("combobox", { name: "Buscar país" });

const optionNames = () => screen.queryAllByRole("option").map((element) => element.textContent);

const renderCountrySelect = <TNotApplicable extends string = CountryNotApplicable>(
  props: CountrySelectProps<TNotApplicable>,
) => {
  const user = userEvent.setup();
  return { user, ...render(<CountrySelect<TNotApplicable> flagUrl={() => DATA_FLAG_URL} {...props} />) };
};

const openList = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(countryCombobox());
  return screen.findByRole("dialog");
};

const expectListClosed = () => waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

afterEach(() => vi.restoreAllMocks());

test("the not applicable value is a plain string, apart from null and from every country", () => {
  expect(COUNTRY_NOT_APPLICABLE).toBe("not-applicable");
  expectTypeOf<CountryNotApplicable>().toEqualTypeOf<"not-applicable">();
  expectTypeOf<Parameters<NonNullable<NotApplicableCountrySelectProps["onValueChange"]>>[0]>().toEqualTypeOf<
    CountryCode | "not-applicable" | null
  >();
  expectTypeOf<Parameters<NonNullable<NotApplicableCountrySelectProps<"none">["onValueChange"]>>[0]>().toEqualTypeOf<
    CountryCode | "none" | null
  >();
});

test("the option is off by default: the list starts with the first country, as in 2.2.0", async () => {
  const { user } = renderCountrySelect({});
  await openList(user);
  expect(optionNames()[0]).toBe("Afganistán");
  expect(screen.queryByRole("option", { name: "No aplica" })).not.toBeInTheDocument();
});

test("turned on, No aplica is the first option, without a flag", async () => {
  const { user } = renderCountrySelect({ notApplicableOption: true });
  await openList(user);
  expect(optionNames().slice(0, 2)).toEqual(["No aplica", "Afganistán"]);
  expect(within(getOptionByName("No aplica")).queryByRole("img", { hidden: true })).not.toBeInTheDocument();
});

test("picking it emits the constant, shows its text as an answer and the clear button goes back to null", async () => {
  const onValueChange = vi.fn();
  const { user } = renderCountrySelect({ notApplicableOption: true, onValueChange });
  await openList(user);
  await user.click(getOptionByName("No aplica"));
  await expectListClosed();
  expect(onValueChange).toHaveBeenLastCalledWith(COUNTRY_NOT_APPLICABLE);
  expect(countryCombobox()).toHaveTextContent("No aplica");
  expect(document.querySelector(".gdy-country-select-value")).not.toHaveAttribute("data-placeholder");
  expect(document.querySelector(".gdy-country-select-trigger img")).toBeNull();
  await user.click(screen.getByRole("button", { name: "Quitar selección" }));
  expect(onValueChange).toHaveBeenLastCalledWith(null);
});

test("required takes No aplica as an answer: no error once the list closes", async () => {
  const { user } = renderCountrySelect({ notApplicableOption: true, required: true });
  await openList(user);
  await user.click(getOptionByName("No aplica"));
  await expectListClosed();
  expect(screen.queryByText("Selecciona un país", { selector: ".gdy-field-error" })).not.toBeInTheDocument();
  expect(countryCombobox()).not.toHaveAttribute("aria-invalid");
});

test("required and left empty is still an error", async () => {
  const { user } = renderCountrySelect({ notApplicableOption: true, required: true });
  await openList(user);
  await user.keyboard("{Escape}");
  expect(await screen.findByText("Selecciona un país", { selector: ".gdy-field-error" })).toBeInTheDocument();
});

test("NA is Namibia: it cannot be the not applicable value", () => {
  expectRenderError(<CountrySelect notApplicableOption notApplicableValue="NA" />, InvalidNotApplicableValueError);
});

test("the search finds it by its text and leaves it out for a country", async () => {
  const { user } = renderCountrySelect({ notApplicableOption: true });
  await openList(user);
  await user.type(searchBox(), "no a");
  expect(optionNames()).toContain("No aplica");
  await user.clear(searchBox());
  await user.type(searchBox(), "peru");
  expect(optionNames()).toEqual(["Perú"]);
});

test("its text is replaced with texts.notApplicable everywhere: list, combobox and search", async () => {
  const { user } = renderCountrySelect({ notApplicableOption: true, texts: { notApplicable: "No figura" } });
  await openList(user);
  expect(optionNames()[0]).toBe("No figura");
  await user.type(searchBox(), "figura");
  await user.click(getOptionByName("No figura"));
  await expectListClosed();
  expect(countryCombobox()).toHaveTextContent("No figura");
});

test("an own notApplicableValue is emitted and recognized as the starting value", async () => {
  const onValueChange = vi.fn();
  const { user } = renderCountrySelect({ notApplicableOption: true, notApplicableValue: "none", onValueChange });
  await openList(user);
  await user.click(getOptionByName("No aplica"));
  expect(onValueChange).toHaveBeenLastCalledWith("none");
  render(<CountrySelect aria-label="Otro" notApplicableOption notApplicableValue="none" defaultValue="none" />);
  expect(screen.getByRole("combobox", { name: "Otro" })).toHaveTextContent("No aplica");
});

test("an empty string works as the not applicable value and stays apart from null", async () => {
  const ControlledEmptyValue = () => {
    const [country, setCountry] = useState<CountryCode | "" | null>("");
    return (
      <>
        <CountrySelect notApplicableOption notApplicableValue="" value={country} onValueChange={setCountry} />
        <output>{country === null ? "null" : `"${country}"`}</output>
      </>
    );
  };
  const user = userEvent.setup();
  render(<ControlledEmptyValue />);
  expect(countryCombobox()).toHaveTextContent("No aplica");
  await user.click(screen.getByRole("button", { name: "Quitar selección" }));
  expect(screen.getByRole("status")).toHaveTextContent("null");
  expect(countryCombobox()).toHaveTextContent("Selecciona un país");
});

test("a country code as notApplicableValue throws, since it could not be told apart", () => {
  expectRenderError(<CountrySelect notApplicableOption notApplicableValue="PE" />, InvalidNotApplicableValueError);
});

test("the types keep the option out of multiple mode and infer the own value", () => {
  // @ts-expect-error "no aplica" is single mode only
  const multipleWithOption: CountrySelectProps = { multiple: true, notApplicableOption: true };
  expect(multipleWithOption).toBeDefined();
  const onValueChange = (value: CountryCode | "none" | null) => value;
  render(<CountrySelect aria-label="Tipos" notApplicableOption notApplicableValue="none" onValueChange={onValueChange} />);
  // @ts-expect-error without notApplicableValue the value is "not-applicable", not "none"
  render(<CountrySelect aria-label="Tipos sin valor" notApplicableOption onValueChange={onValueChange} />);
});
