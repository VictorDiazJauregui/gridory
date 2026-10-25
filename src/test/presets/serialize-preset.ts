type PresetValue = unknown;

const OPACITY_SAMPLES = [undefined, "0.1", "var(--tw-bg-opacity)"];

// A preset color is a function of the opacity: compare what it returns for each sample.
const resolveColor = (color: (input: { opacityValue?: string }) => string) =>
  OPACITY_SAMPLES.map((opacityValue) => color({ opacityValue }));

export const serializePreset = (value: PresetValue): PresetValue => {
  if (typeof value === "function") return resolveColor(value as (input: { opacityValue?: string }) => string);
  if (Array.isArray(value)) return value.map(serializePreset);
  if (typeof value !== "object" || value === null) return value;
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, serializePreset(entry)]));
};
