import { within } from "@testing-library/react";
import { expect } from "vitest";

type OptionName = string | RegExp;

const hasText = (element: HTMLElement, name: OptionName) => {
  const text = element.textContent?.trim() ?? "";
  return typeof name === "string" ? text === name : name.test(text);
};

// Replaces getByRole("option", { name }), which computes the name of every option: slow on long lists.
export const getOptionByName = (
  name: OptionName,
  container: HTMLElement = document.body,
): HTMLElement => {
  const matches = within(container)
    .getAllByRole("option", { hidden: true })
    .filter((element) => hasText(element, name));
  expect(matches, `options named ${String(name)}`).toHaveLength(1);
  const [match] = matches;
  expect(match).toBeVisible();
  expect(match).toHaveAccessibleName(name);
  return match;
};
