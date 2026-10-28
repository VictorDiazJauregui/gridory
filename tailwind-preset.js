/**
 * Map the `--gdy-*` tokens of `gridory/styles.css` to Tailwind keys, so your markup (a column `cell`, a
 * `renderCard` output) uses the library's colors and radii. `createGridoryPreset({ prefix })` (recommended) adds
 * prefixed utilities that never collide with your keys; the shadcn-style default export is deprecated.
 */

/**
 * Opacity modifiers (`bg-primary/10`) blend the token with `color-mix`: a variable holding a full color cannot
 * take Tailwind's `<alpha-value>`, and Tailwind 3 would silently drop the modifier and fall back to a blue ring.
 *
 * @param {string} name token name without the `--gdy-` prefix
 */
const token = (name) => ({ opacityValue }) => {
  const variable = `var(--gdy-${name})`;
  if (opacityValue === undefined || String(opacityValue).startsWith("var(")) {
    return variable;
  }
  return `color-mix(in oklab, ${variable} calc(${opacityValue} * 100%), transparent)`;
};

const PLAIN_COLORS = ["background", "foreground"];
const PAIRED_COLORS = ["card", "popover", "primary", "secondary", "muted", "accent", "destructive"];
const CONTROL_COLORS = ["border", "input", "ring"];
const RADII = {
  lg: "var(--gdy-radius)",
  md: "calc(var(--gdy-radius) - 2px)",
  sm: "calc(var(--gdy-radius) - 4px)",
};
const PREFIX_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const pickTokens = (names) => Object.fromEntries(names.map((name) => [name, token(name)]));

const pairWithForeground = (name) => [
  name,
  { DEFAULT: token(name), foreground: token(`${name}-foreground`) },
];

// One list feeds both presets, so they can never drift apart.
const buildColors = () => ({
  ...pickTokens(PLAIN_COLORS),
  ...Object.fromEntries(PAIRED_COLORS.map(pairWithForeground)),
  ...pickTokens(CONTROL_COLORS),
});

export class InvalidPresetPrefixError extends Error {
  /** @param {unknown} prefix */
  constructor(prefix) {
    super(
      `createGridoryPreset needs a prefix of lowercase letters and digits, optionally joined by ` +
        `single hyphens (for example "gdy" or "my-app"); received ${JSON.stringify(prefix)}.`,
    );
    this.name = "InvalidPresetPrefixError";
  }
}

const assertValidPrefix = (prefix) => {
  if (typeof prefix !== "string" || !PREFIX_PATTERN.test(prefix)) {
    throw new InvalidPresetPrefixError(prefix);
  }
};

const prefixRadii = (prefix) =>
  Object.fromEntries(Object.entries(RADII).map(([size, value]) => [`${prefix}-${size}`, value]));

/**
 * Builds a preset whose utilities live under `prefix` (`bg-gdy-primary`, `rounded-gdy-lg`, `bg-gdy-primary/10`),
 * all under new keys of `theme.extend`, so no color or radius of your project changes.
 *
 * @param {{ prefix?: string }} [options] `prefix` defaults to `"gdy"`
 * @returns {import('tailwindcss').Config}
 * @throws {InvalidPresetPrefixError} when the prefix is empty or not lowercase kebab-case
 */
export const createGridoryPreset = ({ prefix = "gdy" } = {}) => {
  assertValidPrefix(prefix);
  return {
    content: [],
    theme: {
      extend: {
        borderColor: { [prefix]: pickTokens(["border"]) },
        outlineColor: { [prefix]: pickTokens(["ring"]) },
        colors: { [prefix]: buildColors() },
        borderRadius: prefixRadii(prefix),
      },
    },
  };
};

/**
 * The shadcn-style preset (`bg-primary`, `border-border`, `rounded-lg`…). Where a project defines those keys
 * itself (shadcn) it wins and the preset adds little; in the keys it does not define, it mixes two palettes.
 *
 * @deprecated Use `createGridoryPreset()` (prefixed utilities). This preset is removed in 2.0.0.
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [],
  theme: {
    extend: {
      borderColor: pickTokens(["border"]),
      outlineColor: pickTokens(["ring"]),
      colors: buildColors(),
      borderRadius: { ...RADII },
    },
  },
};
