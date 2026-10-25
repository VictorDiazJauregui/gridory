import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import gridoryPreset, { createGridoryPreset, InvalidPresetPrefixError } from "../../tailwind-preset.js";
import { serializePreset } from "./presets/serialize-preset";

const PRESET_1_0_1 = JSON.parse(readFileSync(path.resolve("src/test/baselines/tailwind-preset-1.0.1.json"), "utf8"));

const extendOf = (prefix?: string) => createGridoryPreset(prefix === undefined ? undefined : { prefix }).theme?.extend ?? {};

test("the default export is the 1.0.1 preset, value by value", () => {
  expect(serializePreset(gridoryPreset)).toEqual(PRESET_1_0_1);
});

test("createGridoryPreset puts every color and radius of the default under the gdy prefix", () => {
  const extend = serializePreset(extendOf()) as Record<string, Record<string, unknown>>;
  const legacy = PRESET_1_0_1.theme.extend;
  expect(extend.colors).toEqual({ gdy: legacy.colors });
  expect(extend.borderColor).toEqual({ gdy: legacy.borderColor });
  expect(extend.outlineColor).toEqual({ gdy: legacy.outlineColor });
  expect(extend.borderRadius).toEqual({ "gdy-lg": legacy.borderRadius.lg, "gdy-md": legacy.borderRadius.md, "gdy-sm": legacy.borderRadius.sm });
});

test("a custom prefix replaces gdy and no key is left without it", () => {
  const extend = extendOf("my-app") as unknown as Record<string, Record<string, unknown>>;
  expect(Object.keys(extend.colors)).toEqual(["my-app"]);
  expect(Object.keys(extend.borderColor)).toEqual(["my-app"]);
  expect(Object.keys(extend.outlineColor)).toEqual(["my-app"]);
  expect(Object.keys(extend.borderRadius)).toEqual(["my-app-lg", "my-app-md", "my-app-sm"]);
});

test("an opacity modifier blends the token with color-mix", () => {
  const colors = extendOf().colors as unknown as { gdy: { primary: { DEFAULT: (input: { opacityValue?: string }) => string } } };
  expect(colors.gdy.primary.DEFAULT({ opacityValue: "0.1" })).toBe("color-mix(in oklab, var(--gdy-primary) calc(0.1 * 100%), transparent)");
  expect(colors.gdy.primary.DEFAULT({})).toBe("var(--gdy-primary)");
});

test.each(["", "Gdy", "my app", "gdy-", "-gdy", "my--app", "1gdy"])("the prefix %j throws InvalidPresetPrefixError", (prefix) => {
  expect(() => createGridoryPreset({ prefix })).toThrow(InvalidPresetPrefixError);
});

test("the error names the value it received", () => {
  expect(() => createGridoryPreset({ prefix: "My App" })).toThrow(/"My App"/);
});
