/**
 * Gridory Tailwind presets.
 *
 * Map the library's design tokens (`--gdy-*` CSS custom properties, shipped with defaults for
 * light and dark mode in `gridory/styles.css`) to Tailwind theme keys, so your own markup (a
 * column `cell`, a `renderCard` output) can use the colors and radii the library renders with.
 *
 * - `createGridoryPreset({ prefix })` (recommended): utilities under a prefix (`bg-gdy-primary`,
 *   `rounded-gdy-lg`) that never collide with the keys of your project.
 * - The default export: the shadcn-style keys (`bg-primary`, `rounded-lg`). Deprecated.
 */

/**
 * Builds a Tailwind color from a `--gdy-*` token. Plain utilities (`bg-primary`) emit the
 * variable as-is; opacity modifiers (`bg-primary/10`, `ring-ring/50`) blend the token with
 * `color-mix`, because a variable that holds a full color cannot take Tailwind's
 * `<alpha-value>` slot. Without this, Tailwind 3 silently drops the modifier and falls back to
 * its default (blue) ring color.
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
 * Builds a preset whose utilities live under `prefix`: `bg-gdy-primary`,
 * `text-gdy-primary-foreground`, `border-gdy-border`, `outline-gdy-ring`, `rounded-gdy-lg`, and
 * opacity modifiers such as `bg-gdy-primary/10`. Everything goes into `theme.extend` under
 * new keys, so no color or radius of your project changes.
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
 * The shadcn-style preset: `bg-primary`, `border-border`, `rounded-lg`… In a project that
 * defines those keys itself (shadcn) the project wins and the preset adds little, and in the
 * keys it does not define it mixes two palettes.
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
